// #UtilsJS begin

function Utils() {}

Utils.prototype = {
    constructor: Utils,
    isElementInView: function (element, fullyInView, offsetBottom, offsetTop) {
        var rect = element.getBoundingClientRect();
        var elemTop = rect.top;
        var elemBottom = rect.bottom;
        offsetBottom = offsetBottom ? offsetBottom : 0;
        offsetTop = offsetTop ? offsetTop : 0;

        if (fullyInView === true) {
            return (elemTop >= offsetTop) && (elemBottom <= window.innerHeight + offsetBottom);
        } else {
            return elemTop < window.innerHeight - offsetBottom && elemBottom >= offsetTop;
        }
    },
    typeWriter: function(element, i, txt, speed) {
        if (i < txt.length) {
            element.classList.add('typewriter-typing');
            element.classList.remove('typewriter-cursor-blink');
            element.innerHTML += txt.charAt(i);
            i++;
            var deltaSpeed = (Math.random() * 10 + 1 ) * speed;
            setTimeout(this.typeWriter.bind(this, element, i, txt, speed), deltaSpeed );
        }
        else {
            element.classList.remove('typewriter-typing');
            if(element.dataset.typewriterCursorBlink !== undefined) {
                element.classList.add('typewriter-cursor-blink');
            }
            element.dispatchEvent(new Event('onTypewriterFinish'));
        }
    },
    typeWriterRemove: function (element, i, speed) {
        if (i > 0) {
            element.classList.add('typewriter-typing');
            element.classList.remove('typewriter-cursor-blink');
            element.innerHTML = element.innerHTML.slice(0, -1);
            i--;
            setTimeout(this.typeWriterRemove.bind(this, element, i, speed), speed );
        }
        else {
            element.classList.remove('typewriter-typing');
            if(element.dataset.typewriterRemoveCursorBlink !== undefined) {
                element.classList.add('typewriter-cursor-blink');
            }
            element.dispatchEvent(new Event('onTypewriterRemoveFinish'));
        }
    },
    typeWriterConfig: function (element) {
        var text = element.innerHTML;
        var startAfter = element.dataset.typewriterStartAfter ? element.dataset.typewriterStartAfter : null;
        var speed = element.dataset.typewriterSpeed ? element.dataset.typewriterSpeed : 10;
        var delay = element.dataset.typewriterDelay ? element.dataset.typewriterDelay : element.dataset.typewriterDelayStep ? element.dataset.typewriterDelayStep * speed : 0;
        var startTime = element.dataset.typewriterStart ? element.dataset.typewriterStart : 0;
        var write = function(text) {
            element.innerHTML = '';
            setTimeout(function () {
                Utils.typeWriter(element, 0, text, speed);
            }, delay);
        };
        var start = function() {
            element.innerHTML = '';
            setTimeout(function () {
                if (!startAfter) {
                    write(text);
                } else {
                    startAfter = startAfter.split(',');
                    var selector = startAfter[0].trim();
                    var eventName = startAfter[1].trim();
                    var element = document.querySelector(selector);
                    element.addEventListener(eventName, write.bind(this, text));
                }
            }, startTime);
        };
        return {start: start, write: write, element: element};
    },
    typeWriterRemoveConfig: function (element) {
        var startAfter = element.dataset.typewriterRemoveStartAfter ? element.dataset.typewriterRemoveStartAfter : null;
        var speed = element.dataset.typewriterRemoveSpeed ? element.dataset.typewriterRemoveSpeed : 25;
        var delay = element.dataset.typewriterRemoveDelay ? element.dataset.typewriterRemoveDelay : element.dataset.typewriterRemoveDelayStep ? element.dataset.typewriterRemoveDelayStep * speed : 0;
        var startTime = element.dataset.typewriterRemoveStart ? element.dataset.typewriterRemoveStart : 0;
        var write = function() {
            setTimeout(function () {
                var length = element.innerHTML.length;
                Utils.typeWriterRemove(element, length, speed);
            }, delay);
        };
        var start = function() {
            setTimeout(function () {
                if (!startAfter) {
                    write();
                } else {
                    startAfter = startAfter.split(',');
                    var selector = startAfter[0].trim();
                    var eventName = startAfter[1].trim();
                    var element = document.querySelector(selector);
                    element.addEventListener(eventName, write);
                }
            }, startTime);
        };
        return {start: start, write: write, element: element};
    },
    formGroupSwitch: function(elementPrev, elementNext, isReverse) {
        elementNext.classList.remove('form-group-prev', 'form-group-now', 'form-group-reverse');
        elementPrev.classList.remove('form-group-next', 'form-group-now', 'form-group-reverse');
        if (isReverse === true) {
            elementNext.classList.add('form-group-next','form-group-reverse');
            elementPrev.classList.add('form-group-prev','form-group-reverse');
        } else {
            elementNext.classList.add('form-group-next');
            elementPrev.classList.add('form-group-prev');
            elementNext.getElementsByClassName('form-return-back-button').item(0).dataset.formTarget = 'form-group-' + elementPrev.dataset.formGroupPage;
        }
        var makeItActive = function(e) {
            elementNext.classList.add('form-group-now');
            elementNext.classList.remove('form-group-next', 'form-group-reverse');
            elementPrev.classList.remove('form-group-prev', 'form-group-reverse', 'form-group-now');
            elementNext.removeEventListener('animationend', makeItActive);
            elementNext.removeEventListener('webkitAnimationEnd', makeItActive);
        };

        elementNext.addEventListener('webkitAnimationEnd', makeItActive);
        elementNext.addEventListener('animationend', makeItActive);
    },
    onFormGroupSwitchCalled: function(element, isReverse) {
        if ( element.dataset.formTarget === undefined || element.dataset.formProgress === undefined ) return;
        var targetNext = document.getElementsByClassName(element.dataset.formTarget).item(0);
        var targetPrev = document.getElementsByClassName('form-group-now').item(0);
        if (!targetPrev || !targetNext) return;
        if (targetPrev.classList.contains('form-group-next')) return;
        var progressNum = parseInt(element.dataset.formProgress);
        var progressBar = document.getElementsByClassName('progress-circle-svg').item(0);
        var progressNumEl = progressBar.getElementsByClassName('progress-circle-percent-big').item(0);
        var progressNumOld = !isNaN(parseInt(progressNumEl.dataset.progressPercent)) ? parseInt(progressNumEl.dataset.progressPercent) : 0;
        progressNumEl.dataset.progressPercent = progressNum;

        progressBar.classList.remove('progress-circle-0','progress-circle-25','progress-circle-50','progress-circle-75','progress-circle-100');
        progressBar.classList.add('progress-circle-' + progressNum);

        if (isReverse !== true) {
            targetNext.getElementsByClassName('form-return-back-button').item(0).dataset.formProgress = progressNumOld;
        }

        this.growNumber(progressNumEl, progressNumOld, progressNum, 1000 / Math.abs(progressNum - progressNumOld));
        this.formGroupSwitch(targetPrev, targetNext, isReverse);
    },
    growNumber: function(element, i, goal, speed) {
        element.innerHTML = i;
        if ( i < goal ) {
            i++;
            setTimeout(this.growNumber.bind(this, element, i, goal, speed ), speed);
        } else if (i > goal) {
            i--;
            setTimeout(this.growNumber.bind(this, element, i, goal, speed ), speed);
        } else {
            element.dispatchEvent(new Event('onGrowNumberFinished'));
        }
    },
    phoneFormat: function(text) {
        return text.replace(/(\d{1})(\d{3})(\d{3})/, '$1 ($2) $3-');
    },
    serializeJson: function(arr) {
        var r = {};
        arr.map(function(item) {
            r[item.name] = item.value;
        });
        return r;
    },
    textifyJson: function (arr) {
        var message = '💡Новая заявка от ';
        message += '👤<b>' + arr.name + ' ' + arr.surname + '</b>';
        message += '\n    <i> Телефон: </i> ' + arr.phone;
        message += '\n    <i> Почта: </i> ' + arr.email;
        message += '\n    <i> Тип проекта: </i> ' + arr.type;
        message += arr.platform !=='' ? '\n    <i> Платформа: </i> ' + arr.platform : '';
        message += arr.when     !=='' ? '\n    <i> Когда: </i> ' + arr.when : '';
        message += arr.message  !=='' ? '\n    <i> Дополнительно: </i> ' + arr.message : '';
        return encodeURIComponent(message);
    }


};

var Utils = new Utils();

// #UtilsJS end