$( document ).ready(function() {


    var callbackForm = document.getElementById('form-callback');

    // Typewriter activate
    $('.typewriter-effect[data-typewriter=main-heading-3]').on('onTypewriterFinish', function(){
        $('#main-subheader').addClass('fadein-bottom');
    });


    // Form progress check
    $(callbackForm).on('change propertychange click input keyup paste', function() {
        var inputs = this.querySelectorAll('input[required]');
        var progressPercent = this.getElementsByClassName('progress-circle-percent-big').item(0);
        var percentOld = progressPercent.dataset.progressPercent;
        var percentShown = progressPercent.innerHTML;
        var lastPage = this.getElementsByClassName('form-group-fourth').item(0);
        var isLastPage = lastPage.classList.contains('form-group-now') || lastPage.classList.contains('form-group-next');
        var buttonSubmit = this.querySelector('button[type=submit]');
        var buttonSubmitSpan = buttonSubmit.getElementsByTagName('span').item(0)

        var canSubmit = true;

        [].slice.call(inputs).map(function(input) {
            if (input.value === '') {
                canSubmit = false;
            }
        });

        canSubmit &= isLastPage;

        this.classList.toggle('canSubmit', canSubmit);

        if (isLastPage) {
            buttonSubmitSpan.innerHTML = 'Отправить заявку';
        } else {
            buttonSubmitSpan.innerHTML = 'Далее';
        }

        if (canSubmit) {
            buttonSubmit.removeAttribute('disabled');
            Utils.growNumber(progressPercent, percentShown, 100, 1000 / Math.abs(100 - percentShown));
        } else {
            buttonSubmit.setAttribute('disabled','');
            Utils.growNumber(progressPercent, percentShown, percentOld, 1000 / Math.abs(percentOld - percentShown));
        }
    });
    $(callbackForm).on('submit', function(event) {
        event.preventDefault();

        var buttonSubmit = callbackForm.querySelector('button[type=submit]');
        var buttonSubmitSpan = buttonSubmit.getElementsByTagName('span').item(0)
        var data = Utils.serializeJson($(callbackForm).serializeArray());
        var message = Utils.textifyJson(data);
        var src = 'https://api.telegram.org/bot' + Globals.botApi + '/sendMessage?chat_id=' + Globals.chatId + '&parse_mode=html&text=' + message;
        var xhttp = new XMLHttpRequest();

        callbackForm.classList.add('submitting');
        buttonSubmitSpan.innerHTML = 'Отправляем...';


        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log('message send');
                var eigth = document.getElementsByClassName('eighth-section').item(0);
                var ninth = document.getElementsByClassName('ninth-section').item(0);
                eigth.classList.add('fadeout-top');
                ninth.getElementsByClassName('name-here').item(0).innerHTML = data.name;
                eigth.addEventListener('animationend', function () {
                    eigth.style.display = 'none';
                    ninth.style.display = 'block';
                    setTimeout(function(){
                        ninth.classList.add('already-shown');
                    },10);
                });
            }
        };
        xhttp.open("GET", src, true);
        xhttp.send();
    });

});
