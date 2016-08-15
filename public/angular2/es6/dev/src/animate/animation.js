import { DateWrapper, StringWrapper, RegExpWrapper, NumberWrapper, isPresent } from 'angular2/src/facade/lang';
import { Math } from 'angular2/src/facade/math';
import { camelCaseToDashCase } from 'angular2/src/platform/dom/util';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
export class Animation {
    /**
     * Stores the start time and starts the animation
     * @param element
     * @param data
     * @param browserDetails
     */
    constructor(element, data, browserDetails) {
        this.element = element;
        this.data = data;
        this.browserDetails = browserDetails;
        /** functions to be called upon completion */
        this.callbacks = [];
        /** functions for removing event listeners */
        this.eventClearFunctions = [];
        /** flag used to track whether or not the animation has finished */
        this.completed = false;
        this._stringPrefix = '';
        this.startTime = DateWrapper.toMillis(DateWrapper.now());
        this._stringPrefix = DOM.getAnimationPrefix();
        this.setup();
        this.wait((timestamp) => this.start());
    }
    /** total amount of time that the animation should take including delay */
    get totalTime() {
        let delay = this.computedDelay != null ? this.computedDelay : 0;
        let duration = this.computedDuration != null ? this.computedDuration : 0;
        return delay + duration;
    }
    wait(callback) {
        // Firefox requires 2 frames for some reason
        this.browserDetails.raf(callback, 2);
    }
    /**
     * Sets up the initial styles before the animation is started
     */
    setup() {
        if (this.data.fromStyles != null)
            this.applyStyles(this.data.fromStyles);
        if (this.data.duration != null)
            this.applyStyles({ 'transitionDuration': this.data.duration.toString() + 'ms' });
        if (this.data.delay != null)
            this.applyStyles({ 'transitionDelay': this.data.delay.toString() + 'ms' });
    }
    /**
     * After the initial setup has occurred, this method adds the animation styles
     */
    start() {
        this.addClasses(this.data.classesToAdd);
        this.addClasses(this.data.animationClasses);
        this.removeClasses(this.data.classesToRemove);
        if (this.data.toStyles != null)
            this.applyStyles(this.data.toStyles);
        var computedStyles = DOM.getComputedStyle(this.element);
        this.computedDelay =
            Math.max(this.parseDurationString(computedStyles.getPropertyValue(this._stringPrefix + 'transition-delay')), this.parseDurationString(this.element.style.getPropertyValue(this._stringPrefix + 'transition-delay')));
        this.computedDuration = Math.max(this.parseDurationString(computedStyles.getPropertyValue(this._stringPrefix + 'transition-duration')), this.parseDurationString(this.element.style.getPropertyValue(this._stringPrefix + 'transition-duration')));
        this.addEvents();
    }
    /**
     * Applies the provided styles to the element
     * @param styles
     */
    applyStyles(styles) {
        StringMapWrapper.forEach(styles, (value, key) => {
            var dashCaseKey = camelCaseToDashCase(key);
            if (isPresent(DOM.getStyle(this.element, dashCaseKey))) {
                DOM.setStyle(this.element, dashCaseKey, value.toString());
            }
            else {
                DOM.setStyle(this.element, this._stringPrefix + dashCaseKey, value.toString());
            }
        });
    }
    /**
     * Adds the provided classes to the element
     * @param classes
     */
    addClasses(classes) {
        for (let i = 0, len = classes.length; i < len; i++)
            DOM.addClass(this.element, classes[i]);
    }
    /**
     * Removes the provided classes from the element
     * @param classes
     */
    removeClasses(classes) {
        for (let i = 0, len = classes.length; i < len; i++)
            DOM.removeClass(this.element, classes[i]);
    }
    /**
     * Adds events to track when animations have finished
     */
    addEvents() {
        if (this.totalTime > 0) {
            this.eventClearFunctions.push(DOM.onAndCancel(this.element, DOM.getTransitionEnd(), (event) => this.handleAnimationEvent(event)));
        }
        else {
            this.handleAnimationCompleted();
        }
    }
    handleAnimationEvent(event) {
        let elapsedTime = Math.round(event.elapsedTime * 1000);
        if (!this.browserDetails.elapsedTimeIncludesDelay)
            elapsedTime += this.computedDelay;
        event.stopPropagation();
        if (elapsedTime >= this.totalTime)
            this.handleAnimationCompleted();
    }
    /**
     * Runs all animation callbacks and removes temporary classes
     */
    handleAnimationCompleted() {
        this.removeClasses(this.data.animationClasses);
        this.callbacks.forEach(callback => callback());
        this.callbacks = [];
        this.eventClearFunctions.forEach(fn => fn());
        this.eventClearFunctions = [];
        this.completed = true;
    }
    /**
     * Adds animation callbacks to be called upon completion
     * @param callback
     * @returns {Animation}
     */
    onComplete(callback) {
        if (this.completed) {
            callback();
        }
        else {
            this.callbacks.push(callback);
        }
        return this;
    }
    /**
     * Converts the duration string to the number of milliseconds
     * @param duration
     * @returns {number}
     */
    parseDurationString(duration) {
        var maxValue = 0;
        // duration must have at least 2 characters to be valid. (number + type)
        if (duration == null || duration.length < 2) {
            return maxValue;
        }
        else if (duration.substring(duration.length - 2) == 'ms') {
            let value = NumberWrapper.parseInt(this.stripLetters(duration), 10);
            if (value > maxValue)
                maxValue = value;
        }
        else if (duration.substring(duration.length - 1) == 's') {
            let ms = NumberWrapper.parseFloat(this.stripLetters(duration)) * 1000;
            let value = Math.floor(ms);
            if (value > maxValue)
                maxValue = value;
        }
        return maxValue;
    }
    /**
     * Strips the letters from the duration string
     * @param str
     * @returns {string}
     */
    stripLetters(str) {
        return StringWrapper.replaceAll(str, RegExpWrapper.create('[^0-9]+$', ''), '');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW5ndWxhcjIvc3JjL2FuaW1hdGUvYW5pbWF0aW9uLnRzIl0sIm5hbWVzIjpbIkFuaW1hdGlvbiIsIkFuaW1hdGlvbi5jb25zdHJ1Y3RvciIsIkFuaW1hdGlvbi50b3RhbFRpbWUiLCJBbmltYXRpb24ud2FpdCIsIkFuaW1hdGlvbi5zZXR1cCIsIkFuaW1hdGlvbi5zdGFydCIsIkFuaW1hdGlvbi5hcHBseVN0eWxlcyIsIkFuaW1hdGlvbi5hZGRDbGFzc2VzIiwiQW5pbWF0aW9uLnJlbW92ZUNsYXNzZXMiLCJBbmltYXRpb24uYWRkRXZlbnRzIiwiQW5pbWF0aW9uLmhhbmRsZUFuaW1hdGlvbkV2ZW50IiwiQW5pbWF0aW9uLmhhbmRsZUFuaW1hdGlvbkNvbXBsZXRlZCIsIkFuaW1hdGlvbi5vbkNvbXBsZXRlIiwiQW5pbWF0aW9uLnBhcnNlRHVyYXRpb25TdHJpbmciLCJBbmltYXRpb24uc3RyaXBMZXR0ZXJzIl0sIm1hcHBpbmdzIjoiT0FBTyxFQUNMLFdBQVcsRUFDWCxhQUFhLEVBQ2IsYUFBYSxFQUNiLGFBQWEsRUFDYixTQUFTLEVBQ1YsTUFBTSwwQkFBMEI7T0FDMUIsRUFBQyxJQUFJLEVBQUMsTUFBTSwwQkFBMEI7T0FDdEMsRUFBQyxtQkFBbUIsRUFBQyxNQUFNLGdDQUFnQztPQUMzRCxFQUFDLGdCQUFnQixFQUFDLE1BQU0sZ0NBQWdDO09BQ3hELEVBQUMsR0FBRyxFQUFDLE1BQU0sdUNBQXVDO0FBS3pEO0lBNEJFQTs7Ozs7T0FLR0E7SUFDSEEsWUFBbUJBLE9BQW9CQSxFQUFTQSxJQUF5QkEsRUFDdERBLGNBQThCQTtRQUQ5QkMsWUFBT0EsR0FBUEEsT0FBT0EsQ0FBYUE7UUFBU0EsU0FBSUEsR0FBSkEsSUFBSUEsQ0FBcUJBO1FBQ3REQSxtQkFBY0EsR0FBZEEsY0FBY0EsQ0FBZ0JBO1FBbENqREEsNkNBQTZDQTtRQUM3Q0EsY0FBU0EsR0FBZUEsRUFBRUEsQ0FBQ0E7UUFXM0JBLDZDQUE2Q0E7UUFDN0NBLHdCQUFtQkEsR0FBZUEsRUFBRUEsQ0FBQ0E7UUFFckNBLG1FQUFtRUE7UUFDbkVBLGNBQVNBLEdBQVlBLEtBQUtBLENBQUNBO1FBRW5CQSxrQkFBYUEsR0FBV0EsRUFBRUEsQ0FBQ0E7UUFpQmpDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxXQUFXQSxDQUFDQSxRQUFRQSxDQUFDQSxXQUFXQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQSxDQUFDQTtRQUN6REEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsR0FBR0EsQ0FBQ0Esa0JBQWtCQSxFQUFFQSxDQUFDQTtRQUM5Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7UUFDYkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsU0FBY0EsS0FBS0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7SUFDOUNBLENBQUNBO0lBbkJERCwwRUFBMEVBO0lBQzFFQSxJQUFJQSxTQUFTQTtRQUNYRSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxhQUFhQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNoRUEsSUFBSUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLEdBQUdBLENBQUNBLENBQUNBO1FBQ3pFQSxNQUFNQSxDQUFDQSxLQUFLQSxHQUFHQSxRQUFRQSxDQUFDQTtJQUMxQkEsQ0FBQ0E7SUFnQkRGLElBQUlBLENBQUNBLFFBQWtCQTtRQUNyQkcsNENBQTRDQTtRQUM1Q0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDdkNBLENBQUNBO0lBRURIOztPQUVHQTtJQUNIQSxLQUFLQTtRQUNISSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxJQUFJQSxJQUFJQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTtRQUN6RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsSUFBSUEsSUFBSUEsQ0FBQ0E7WUFDN0JBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEVBQUNBLG9CQUFvQkEsRUFBRUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsRUFBRUEsR0FBR0EsSUFBSUEsRUFBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDakZBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLElBQUlBLElBQUlBLENBQUNBO1lBQzFCQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFDQSxpQkFBaUJBLEVBQUVBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFFBQVFBLEVBQUVBLEdBQUdBLElBQUlBLEVBQUNBLENBQUNBLENBQUNBO0lBQzdFQSxDQUFDQTtJQUVESjs7T0FFR0E7SUFDSEEsS0FBS0E7UUFDSEssSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFDeENBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0E7UUFDNUNBLElBQUlBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBO1FBQzlDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxJQUFJQSxJQUFJQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFD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RkEsQ0FBQ0E7QUFDSGQsQ0FBQ0E7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERhdGVXcmFwcGVyLFxuICBTdHJpbmdXcmFwcGVyLFxuICBSZWdFeHBXcmFwcGVyLFxuICBOdW1iZXJXcmFwcGVyLFxuICBpc1ByZXNlbnRcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TWF0aH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9tYXRoJztcbmltcG9ydCB7Y2FtZWxDYXNlVG9EYXNoQ2FzZX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL2RvbS91dGlsJztcbmltcG9ydCB7U3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7RE9NfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vZG9tL2RvbV9hZGFwdGVyJztcblxuaW1wb3J0IHtCcm93c2VyRGV0YWlsc30gZnJvbSAnLi9icm93c2VyX2RldGFpbHMnO1xuaW1wb3J0IHtDc3NBbmltYXRpb25PcHRpb25zfSBmcm9tICcuL2Nzc19hbmltYXRpb25fb3B0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb24ge1xuICAvKiogZnVuY3Rpb25zIHRvIGJlIGNhbGxlZCB1cG9uIGNvbXBsZXRpb24gKi9cbiAgY2FsbGJhY2tzOiBGdW5jdGlvbltdID0gW107XG5cbiAgLyoqIHRoZSBkdXJhdGlvbiAobXMpIG9mIHRoZSBhbmltYXRpb24gKHdoZXRoZXIgZnJvbSBDU1Mgb3IgbWFudWFsbHkgc2V0KSAqL1xuICBjb21wdXRlZER1cmF0aW9uOiBudW1iZXI7XG5cbiAgLyoqIHRoZSBhbmltYXRpb24gZGVsYXkgKG1zKSAod2hldGhlciBmcm9tIENTUyBvciBtYW51YWxseSBzZXQpICovXG4gIGNvbXB1dGVkRGVsYXk6IG51bWJlcjtcblxuICAvKiogdGltZXN0YW1wIG9mIHdoZW4gdGhlIGFuaW1hdGlvbiBzdGFydGVkICovXG4gIHN0YXJ0VGltZTogbnVtYmVyO1xuXG4gIC8qKiBmdW5jdGlvbnMgZm9yIHJlbW92aW5nIGV2ZW50IGxpc3RlbmVycyAqL1xuICBldmVudENsZWFyRnVuY3Rpb25zOiBGdW5jdGlvbltdID0gW107XG5cbiAgLyoqIGZsYWcgdXNlZCB0byB0cmFjayB3aGV0aGVyIG9yIG5vdCB0aGUgYW5pbWF0aW9uIGhhcyBmaW5pc2hlZCAqL1xuICBjb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF9zdHJpbmdQcmVmaXg6IHN0cmluZyA9ICcnO1xuXG4gIC8qKiB0b3RhbCBhbW91bnQgb2YgdGltZSB0aGF0IHRoZSBhbmltYXRpb24gc2hvdWxkIHRha2UgaW5jbHVkaW5nIGRlbGF5ICovXG4gIGdldCB0b3RhbFRpbWUoKTogbnVtYmVyIHtcbiAgICBsZXQgZGVsYXkgPSB0aGlzLmNvbXB1dGVkRGVsYXkgIT0gbnVsbCA/IHRoaXMuY29tcHV0ZWREZWxheSA6IDA7XG4gICAgbGV0IGR1cmF0aW9uID0gdGhpcy5jb21wdXRlZER1cmF0aW9uICE9IG51bGwgPyB0aGlzLmNvbXB1dGVkRHVyYXRpb24gOiAwO1xuICAgIHJldHVybiBkZWxheSArIGR1cmF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlcyB0aGUgc3RhcnQgdGltZSBhbmQgc3RhcnRzIHRoZSBhbmltYXRpb25cbiAgICogQHBhcmFtIGVsZW1lbnRcbiAgICogQHBhcmFtIGRhdGFcbiAgICogQHBhcmFtIGJyb3dzZXJEZXRhaWxzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogSFRNTEVsZW1lbnQsIHB1YmxpYyBkYXRhOiBDc3NBbmltYXRpb25PcHRpb25zLFxuICAgICAgICAgICAgICBwdWJsaWMgYnJvd3NlckRldGFpbHM6IEJyb3dzZXJEZXRhaWxzKSB7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBEYXRlV3JhcHBlci50b01pbGxpcyhEYXRlV3JhcHBlci5ub3coKSk7XG4gICAgdGhpcy5fc3RyaW5nUHJlZml4ID0gRE9NLmdldEFuaW1hdGlvblByZWZpeCgpO1xuICAgIHRoaXMuc2V0dXAoKTtcbiAgICB0aGlzLndhaXQoKHRpbWVzdGFtcDogYW55KSA9PiB0aGlzLnN0YXJ0KCkpO1xuICB9XG5cbiAgd2FpdChjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAvLyBGaXJlZm94IHJlcXVpcmVzIDIgZnJhbWVzIGZvciBzb21lIHJlYXNvblxuICAgIHRoaXMuYnJvd3NlckRldGFpbHMucmFmKGNhbGxiYWNrLCAyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHVwIHRoZSBpbml0aWFsIHN0eWxlcyBiZWZvcmUgdGhlIGFuaW1hdGlvbiBpcyBzdGFydGVkXG4gICAqL1xuICBzZXR1cCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kYXRhLmZyb21TdHlsZXMgIT0gbnVsbCkgdGhpcy5hcHBseVN0eWxlcyh0aGlzLmRhdGEuZnJvbVN0eWxlcyk7XG4gICAgaWYgKHRoaXMuZGF0YS5kdXJhdGlvbiAhPSBudWxsKVxuICAgICAgdGhpcy5hcHBseVN0eWxlcyh7J3RyYW5zaXRpb25EdXJhdGlvbic6IHRoaXMuZGF0YS5kdXJhdGlvbi50b1N0cmluZygpICsgJ21zJ30pO1xuICAgIGlmICh0aGlzLmRhdGEuZGVsYXkgIT0gbnVsbClcbiAgICAgIHRoaXMuYXBwbHlTdHlsZXMoeyd0cmFuc2l0aW9uRGVsYXknOiB0aGlzLmRhdGEuZGVsYXkudG9TdHJpbmcoKSArICdtcyd9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZnRlciB0aGUgaW5pdGlhbCBzZXR1cCBoYXMgb2NjdXJyZWQsIHRoaXMgbWV0aG9kIGFkZHMgdGhlIGFuaW1hdGlvbiBzdHlsZXNcbiAgICovXG4gIHN0YXJ0KCk6IHZvaWQge1xuICAgIHRoaXMuYWRkQ2xhc3Nlcyh0aGlzLmRhdGEuY2xhc3Nlc1RvQWRkKTtcbiAgICB0aGlzLmFkZENsYXNzZXModGhpcy5kYXRhLmFuaW1hdGlvbkNsYXNzZXMpO1xuICAgIHRoaXMucmVtb3ZlQ2xhc3Nlcyh0aGlzLmRhdGEuY2xhc3Nlc1RvUmVtb3ZlKTtcbiAgICBpZiAodGhpcy5kYXRhLnRvU3R5bGVzICE9IG51bGwpIHRoaXMuYXBwbHlTdHlsZXModGhpcy5kYXRhLnRvU3R5bGVzKTtcbiAgICB2YXIgY29tcHV0ZWRTdHlsZXMgPSBET00uZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuY29tcHV0ZWREZWxheSA9XG4gICAgICAgIE1hdGgubWF4KHRoaXMucGFyc2VEdXJhdGlvblN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgIGNvbXB1dGVkU3R5bGVzLmdldFByb3BlcnR5VmFsdWUodGhpcy5fc3RyaW5nUHJlZml4ICsgJ3RyYW5zaXRpb24tZGVsYXknKSksXG4gICAgICAgICAgICAgICAgIHRoaXMucGFyc2VEdXJhdGlvblN0cmluZyhcbiAgICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHRoaXMuX3N0cmluZ1ByZWZpeCArICd0cmFuc2l0aW9uLWRlbGF5JykpKTtcbiAgICB0aGlzLmNvbXB1dGVkRHVyYXRpb24gPSBNYXRoLm1heCh0aGlzLnBhcnNlRHVyYXRpb25TdHJpbmcoY29tcHV0ZWRTdHlsZXMuZ2V0UHJvcGVydHlWYWx1ZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RyaW5nUHJlZml4ICsgJ3RyYW5zaXRpb24tZHVyYXRpb24nKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXJzZUR1cmF0aW9uU3RyaW5nKHRoaXMuZWxlbWVudC5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdHJpbmdQcmVmaXggKyAndHJhbnNpdGlvbi1kdXJhdGlvbicpKSk7XG4gICAgdGhpcy5hZGRFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIHRoZSBwcm92aWRlZCBzdHlsZXMgdG8gdGhlIGVsZW1lbnRcbiAgICogQHBhcmFtIHN0eWxlc1xuICAgKi9cbiAgYXBwbHlTdHlsZXMoc3R5bGVzOiB7W2tleTogc3RyaW5nXTogYW55fSk6IHZvaWQge1xuICAgIFN0cmluZ01hcFdyYXBwZXIuZm9yRWFjaChzdHlsZXMsICh2YWx1ZTogYW55LCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgdmFyIGRhc2hDYXNlS2V5ID0gY2FtZWxDYXNlVG9EYXNoQ2FzZShrZXkpO1xuICAgICAgaWYgKGlzUHJlc2VudChET00uZ2V0U3R5bGUodGhpcy5lbGVtZW50LCBkYXNoQ2FzZUtleSkpKSB7XG4gICAgICAgIERPTS5zZXRTdHlsZSh0aGlzLmVsZW1lbnQsIGRhc2hDYXNlS2V5LCB2YWx1ZS50b1N0cmluZygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERPTS5zZXRTdHlsZSh0aGlzLmVsZW1lbnQsIHRoaXMuX3N0cmluZ1ByZWZpeCArIGRhc2hDYXNlS2V5LCB2YWx1ZS50b1N0cmluZygpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBwcm92aWRlZCBjbGFzc2VzIHRvIHRoZSBlbGVtZW50XG4gICAqIEBwYXJhbSBjbGFzc2VzXG4gICAqL1xuICBhZGRDbGFzc2VzKGNsYXNzZXM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGNsYXNzZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIERPTS5hZGRDbGFzcyh0aGlzLmVsZW1lbnQsIGNsYXNzZXNbaV0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIHByb3ZpZGVkIGNsYXNzZXMgZnJvbSB0aGUgZWxlbWVudFxuICAgKiBAcGFyYW0gY2xhc3Nlc1xuICAgKi9cbiAgcmVtb3ZlQ2xhc3NlcyhjbGFzc2VzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBjbGFzc2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSBET00ucmVtb3ZlQ2xhc3ModGhpcy5lbGVtZW50LCBjbGFzc2VzW2ldKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGV2ZW50cyB0byB0cmFjayB3aGVuIGFuaW1hdGlvbnMgaGF2ZSBmaW5pc2hlZFxuICAgKi9cbiAgYWRkRXZlbnRzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnRvdGFsVGltZSA+IDApIHtcbiAgICAgIHRoaXMuZXZlbnRDbGVhckZ1bmN0aW9ucy5wdXNoKERPTS5vbkFuZENhbmNlbChcbiAgICAgICAgICB0aGlzLmVsZW1lbnQsIERPTS5nZXRUcmFuc2l0aW9uRW5kKCksIChldmVudDogYW55KSA9PiB0aGlzLmhhbmRsZUFuaW1hdGlvbkV2ZW50KGV2ZW50KSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhbmRsZUFuaW1hdGlvbkNvbXBsZXRlZCgpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZUFuaW1hdGlvbkV2ZW50KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICBsZXQgZWxhcHNlZFRpbWUgPSBNYXRoLnJvdW5kKGV2ZW50LmVsYXBzZWRUaW1lICogMTAwMCk7XG4gICAgaWYgKCF0aGlzLmJyb3dzZXJEZXRhaWxzLmVsYXBzZWRUaW1lSW5jbHVkZXNEZWxheSkgZWxhcHNlZFRpbWUgKz0gdGhpcy5jb21wdXRlZERlbGF5O1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChlbGFwc2VkVGltZSA+PSB0aGlzLnRvdGFsVGltZSkgdGhpcy5oYW5kbGVBbmltYXRpb25Db21wbGV0ZWQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSdW5zIGFsbCBhbmltYXRpb24gY2FsbGJhY2tzIGFuZCByZW1vdmVzIHRlbXBvcmFyeSBjbGFzc2VzXG4gICAqL1xuICBoYW5kbGVBbmltYXRpb25Db21wbGV0ZWQoKTogdm9pZCB7XG4gICAgdGhpcy5yZW1vdmVDbGFzc2VzKHRoaXMuZGF0YS5hbmltYXRpb25DbGFzc2VzKTtcbiAgICB0aGlzLmNhbGxiYWNrcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKCkpO1xuICAgIHRoaXMuY2FsbGJhY2tzID0gW107XG4gICAgdGhpcy5ldmVudENsZWFyRnVuY3Rpb25zLmZvckVhY2goZm4gPT4gZm4oKSk7XG4gICAgdGhpcy5ldmVudENsZWFyRnVuY3Rpb25zID0gW107XG4gICAgdGhpcy5jb21wbGV0ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYW5pbWF0aW9uIGNhbGxiYWNrcyB0byBiZSBjYWxsZWQgdXBvbiBjb21wbGV0aW9uXG4gICAqIEBwYXJhbSBjYWxsYmFja1xuICAgKiBAcmV0dXJucyB7QW5pbWF0aW9ufVxuICAgKi9cbiAgb25Db21wbGV0ZShjYWxsYmFjazogRnVuY3Rpb24pOiBBbmltYXRpb24ge1xuICAgIGlmICh0aGlzLmNvbXBsZXRlZCkge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHRoZSBkdXJhdGlvbiBzdHJpbmcgdG8gdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHNcbiAgICogQHBhcmFtIGR1cmF0aW9uXG4gICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAqL1xuICBwYXJzZUR1cmF0aW9uU3RyaW5nKGR1cmF0aW9uOiBzdHJpbmcpOiBudW1iZXIge1xuICAgIHZhciBtYXhWYWx1ZSA9IDA7XG4gICAgLy8gZHVyYXRpb24gbXVzdCBoYXZlIGF0IGxlYXN0IDIgY2hhcmFjdGVycyB0byBiZSB2YWxpZC4gKG51bWJlciArIHR5cGUpXG4gICAgaWYgKGR1cmF0aW9uID09IG51bGwgfHwgZHVyYXRpb24ubGVuZ3RoIDwgMikge1xuICAgICAgcmV0dXJuIG1heFZhbHVlO1xuICAgIH0gZWxzZSBpZiAoZHVyYXRpb24uc3Vic3RyaW5nKGR1cmF0aW9uLmxlbmd0aCAtIDIpID09ICdtcycpIHtcbiAgICAgIGxldCB2YWx1ZSA9IE51bWJlcldyYXBwZXIucGFyc2VJbnQodGhpcy5zdHJpcExldHRlcnMoZHVyYXRpb24pLCAxMCk7XG4gICAgICBpZiAodmFsdWUgPiBtYXhWYWx1ZSkgbWF4VmFsdWUgPSB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKGR1cmF0aW9uLnN1YnN0cmluZyhkdXJhdGlvbi5sZW5ndGggLSAxKSA9PSAncycpIHtcbiAgICAgIGxldCBtcyA9IE51bWJlcldyYXBwZXIucGFyc2VGbG9hdCh0aGlzLnN0cmlwTGV0dGVycyhkdXJhdGlvbikpICogMTAwMDtcbiAgICAgIGxldCB2YWx1ZSA9IE1hdGguZmxvb3IobXMpO1xuICAgICAgaWYgKHZhbHVlID4gbWF4VmFsdWUpIG1heFZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIHJldHVybiBtYXhWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdHJpcHMgdGhlIGxldHRlcnMgZnJvbSB0aGUgZHVyYXRpb24gc3RyaW5nXG4gICAqIEBwYXJhbSBzdHJcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHN0cmlwTGV0dGVycyhzdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIFN0cmluZ1dyYXBwZXIucmVwbGFjZUFsbChzdHIsIFJlZ0V4cFdyYXBwZXIuY3JlYXRlKCdbXjAtOV0rJCcsICcnKSwgJycpO1xuICB9XG59XG4iXX0=