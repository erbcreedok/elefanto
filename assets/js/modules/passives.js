// #PassiveJS begin

function Passives() {}

Passives.prototype = {
    constructor: Passives,

    start: function () {
        this.toggleClassOnClick();
        this.addClassOnScroll();
        this.typewriter();
        this.typewriterRemove();
        this.formRadioOnClick();
        this.formBackButtonOnClick();
        this.phoneInputCheck();
        this.tabChange();
    },

    // Toggle class on click
    toggleClassOnClick: function() {
        [].slice.call(document.getElementsByClassName('toggle-class-on-click')).map(function(element) {
            element.onclick = function () {
                if (element.dataset.target && element.dataset.className) {
                    [].slice.call(document.querySelectorAll(element.dataset.target)).map(function(target) {
                        target.classList.toggle(element.dataset.className);
                    });
                }
            }
        });
    },

    // Adds 'already-shown' class by default
    addClassOnScroll: function() {
        var lastScrollTop = 0;

        var addClassToAppeared = function(element) {
            if (Utils.isElementInView(element, false, 10)) {
                element.classList.add('already-shown');
                var st = window.pageYOffset || document.documentElement.scrollTop;
                if (st < lastScrollTop){
                    element.classList.add('appeared-from-top');
                }
                lastScrollTop = st;
            }
        };

        [].slice.call(document.getElementsByClassName('check-on-scroll')).map(function(element) {
            if (Utils.isElementInView(element, false, 10)) {
                addClassToAppeared(element);
            }
            window.addEventListener('scroll', addClassToAppeared.bind(this, element));
        });
    },

    // TypeWriter effects
    typewriter: function () {
        [].slice.call(document.getElementsByClassName('typewriter-effect')).map(function(element){
            Utils.typeWriterConfig(element).start();
        });
    },

    typewriterRemove: function () {
        [].slice.call(document.getElementsByClassName('typewriter-remove-effect')).map(function(element){
            Utils.typeWriterRemoveConfig(element).start();
        });
    },

    // Switch forms when radio-image pressed
    formRadioOnClick: function() {
        [].slice.call(document.getElementsByClassName('form-radio-image')).map(function(element) {
            element.addEventListener('click', function() {
                Utils.onFormGroupSwitchCalled(element);
                var input = element.parentNode.querySelector('input[type=hidden]');
                if (input) {
                    input.value = element.dataset.formValue;
                }
            });
        });
    },

    // Switch forms when back-button pressed
    formBackButtonOnClick: function() {
        [].slice.call(document.getElementsByClassName('form-return-back-button')).map(function(element) {
            element.addEventListener('click', function () {
                Utils.onFormGroupSwitchCalled(element, true);
                var input = element.parentNode.parentNode.querySelector('input[type=hidden]');
                if (input) {
                    input.value = '';
                }
            });
        });
    },

    //Phone restrict non numeric
    phoneInputCheck: function() {
        [].slice.call(document.querySelectorAll('input[type=tel]')).map(function(elem){
            elem.addEventListener('keypress', function(event) {
                if (event.which !== 43 && (event.which < 48 || event.which > 57))
                {
                    event.preventDefault();
                }
            });
        });
    },

    tabChange: function () {
        [].slice.call(document.querySelectorAll('.tabs-container .tab')).map(function(element){
            element.addEventListener('click', function() {
                Utils.onChangeTab(element);
            });
        });
    }


};

var Passives = new Passives();

$(document).ready(function() {
    Passives.start();
});


// #PassiveJS end