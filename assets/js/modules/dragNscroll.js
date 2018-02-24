(function() {

    var container = document.getElementsByClassName('tab-cards-container').item(0);
    var cards = [].slice.call(container.children);
    if (!container) return;
    var timer = null;
    var snapPoints = [];
    var activeIndex = 0;
    var lastContainerLeft = 0;
    var isAnimating = false;
    var scrollEndDelay = 66;
    var isMobileView = false;

    var getSnapPoints = function () {
        if (!isMobileView) return;
        var p = [];
        cards.forEach(function(card) {
            var point = Utils.elementHorizontalOffset(card);
            p.push(point);
        });
        snapPoints = p;
    };
    var snapToCenter = function(direction) {
        if (!isMobileView) return;
        activeIndex += direction==='left' ? -1 : direction==='right' ? 1 : 0;
        if (activeIndex <= 0) activeIndex = 0;
        if (activeIndex >= snapPoints.length - 1) activeIndex = snapPoints.length - 1;
        var point = -snapPoints[activeIndex];
        isAnimating = true;
        $(container).animate({
            scrollLeft: point
        }, 400, function() {
            setTimeout(function () {
                isAnimating = false;
            }, scrollEndDelay * 3);
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
        console.log(isMobileView);
    };

    container.addEventListener('scroll', function() {
        var sl = container.scrollLeft;
        var direction =  (sl < lastContainerLeft) ? 'left' : 'right';
        if(timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            $(container).trigger('scrollend', [direction]);
        }, scrollEndDelay);
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

    $(container).on('scrollend', function(e, direction) {
        if (Globals.servicesSection.isSnapOnScroll && !isAnimating) {
            if (!(direction==='left' && activeIndex<=0) && !(direction==='right' && activeIndex>=snapPoints.length - 1)) {
                snapToCenter(direction);
            }
        }
    });

    checkMobileView();
    getSnapPoints();
    scaleByPosition();

})();
