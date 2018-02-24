(function() {

    // Gloabal Variables
    var container = document.getElementsByClassName('tab-cards-container').item(0);
    var cards = [].slice.call(container.children);
    if (!container) return;
    var timer = null;
    var snapPoints = [];
    var activeIndex = 0;
    var lastContainerLeft = 0;
    var isAnimating = false;
    var scrollEndDelay = 100;
    var isMobileView = false;
    var scrollDirection = '';
    var isTouching = false;
    var isTouchScroll = false;

    // Global Functions
    var getSnapPoints = function () {
        if (!isMobileView) return;
        var p = [];
        cards.forEach(function(card) {
            var point = Utils.elementHorizontalOffset(card);
            p.push(point);
        });
        snapPoints = p;
    };
    var snapToCenter = function() {
        if (!isMobileView) return;

        var scrollPoint = container.scrollLeft;
        var minDelta = 99999;

        snapPoints.forEach(function(snapPoint, i) {
            if (scrollDirection === 'left' && scrollPoint + snapPoint < 0 )return;
            if (scrollDirection === 'right' && scrollPoint + snapPoint > 0 )return;
            if (Math.abs(scrollPoint + snapPoint ) < minDelta) {
                activeIndex = i;
                minDelta = Math.abs(scrollPoint + snapPoints[activeIndex]);
            }
        });
        var point = -snapPoints[activeIndex];

        isAnimating = true;
        $(container).animate({
            scrollLeft: point
        }, 400, function() {
            setTimeout(function () {
                isAnimating = false;
            }, scrollEndDelay + 500);
        });
    };
    var scaleByPosition = function() {
        if (!isMobileView) {
            cards.forEach(function (card) {
                var scale = 1;
                card.style.webkitTransform = 'scale(' + scale + ')';
                card.style.mozTransform = 'scale(' + scale + ')';
                card.style.msTransform = 'scale(' + scale + ')';
                card.style.oTransform = 'scale(' + scale + ')';
                card.style.transform = 'scale(' + scale + ')';
            });
            return;
        }
        cards.forEach(function (card) {
            if (Utils.isElementInHorizontalView(card, container)) {
                var scale = (1 - 0.05 * Math.abs(Utils.elementHorizontalOffset(card, true)));
                card.style.webkitTransform = 'scale(' + scale + ')';
                card.style.mozTransform = 'scale(' + scale + ')';
                card.style.msTransform = 'scale(' + scale + ')';
                card.style.oTransform = 'scale(' + scale + ')';
                card.style.transform = 'scale(' + scale + ')';
            }
        });
    };
    var checkMobileView = function() {
        isMobileView = window.innerWidth <= 992;
    };
    var setScrollEndTimer = function() {
        if(timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            $(container).trigger('scrollend');
        }, scrollEndDelay);
    };


    // Setup Functions;
    checkMobileView();
    getSnapPoints();
    scaleByPosition();


    // Event Listeners
    container.addEventListener('scroll', function() {
        var sl = container.scrollLeft;
        scrollDirection =  (sl < lastContainerLeft) ? 'left' : 'right';

        if (!isTouching) {
            setScrollEndTimer();
        } else {
            isTouchScroll = true;
        }
        lastContainerLeft = sl;
    }, false);
    container.addEventListener('scroll', function() {
        scaleByPosition();
    });
    window.addEventListener('resize', function() {
        checkMobileView();
        getSnapPoints();
        scaleByPosition();
    });
    $(container).on('touchstart', function() {
        isTouching = true;
    });
    Utils.listenEvents(container, 'touchend touchcancel', function () {
        isTouching = false;
        if (isTouchScroll) {
            isTouchScroll = false;
            $(container).trigger('scrollend');
        }
    });
    $(container).on('scrollend', function() {
        if (Globals.servicesSection.isSnapOnScroll && !isAnimating) {
            snapToCenter();
        }
    });
})();
