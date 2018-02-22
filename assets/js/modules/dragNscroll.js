(function() {

    var container = document.getElementsByClassName('tab-cards-container').item(0);
    var cards = [].slice.call(container.children);
    if (!container) return;
    var snapPoints = [];
    var timer = null;

    cards.forEach(function(card) {
       var point = Utils.elementHorizontalOffset(card);
       snapPoints.push(point);
       console.log(point);
    });

    var snapToCenter = function() {
        var scrollPoint = container.scrollLeft;
        var point = -snapPoints[0];
        var pointDelta = scrollPoint - point;
        snapPoints.forEach(function (snapPoint) {
            if (Math.abs(scrollPoint + snapPoint) < Math.abs(pointDelta)) {
                point = -snapPoint;
                pointDelta = scrollPoint - point;
            }
        });
        $(container).animate({
            scrollLeft: point
        }, 400);
    };
    var scaleByPosition = function() {
        cards.forEach(function (card) {
            var scale = (1 - 0.05 * Math.abs(Utils.elementHorizontalOffset(card, true)));
            card.style.webkitTransform = 'scale(' + scale + ')';
            card.style.mozTransform = 'scale(' + scale + ')';
            card.style.msTransform = 'scale(' + scale + ')';
            card.style.oTransform = 'scale(' + scale + ')';
            card.style.transform = 'scale(' + scale + ')';
        });
    };

    container.addEventListener('scroll', function() {
        scaleByPosition();
        if(timer !== null) {
            clearTimeout(timer);
        }
        timer = setTimeout(function() {
            $(container).trigger('scrollend', []);
        }, 66);
    }, false);

    $(container).on('scrollend', function() {
        snapToCenter();
    });

    scaleByPosition();

})();
