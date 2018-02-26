$( document ).ready(function() {

    var callbackForm = document.getElementById('form-callback');
    var callbackFormModal = document.getElementById('form-callback-modal');

    // Typewriter activate
    $('.typewriter-effect[data-typewriter=main-heading-3]').on('onTypewriterFinish', function(){
        $('#main-subheader').addClass('fadein-bottom');
    });


    var onEighthSectionFormDataSend = function(data) {
        var eigth = document.getElementsByClassName('eighth-section').item(0);
        var ninth = document.getElementsByClassName('ninth-section').item(0);
        eigth.classList.add('fadeout-top');
        ninth.getElementsByClassName('name-here').item(0).innerHTML = data.name;
        var animationEnd = function() {
            eigth.style.display = 'none';
            ninth.style.display = 'block';
            setTimeout(function(){
                ninth.classList.add('already-shown');
            },10);
            eigth.removeEventListener('animationend', animationEnd);
        };
        eigth.addEventListener('animationend', animationEnd);
    };
    var onCallbackFormModalDataSend = function(form ,data) {
        var modalFormInputs = Utils.findParent(form, 'modal-body');
        var modalFormSuccess = modalFormInputs.nextElementSibling;
        var modalItSelf = Utils.findParent(modalFormInputs, 'modal');
        modalFormSuccess.getElementsByClassName('name-here').item(0).innerHTML = data.name;
        modalFormInputs.classList.add('fadeout-top');
        var animationEnd = function() {
            modalFormInputs.style.display = 'none';
            modalFormSuccess.style.display = 'block';
            setTimeout(function () {
                modalFormSuccess.classList.add('already-shown');
            }, 10);
            setTimeout(function() {
                $(modalItSelf).modal('hide');
            }, 5000);
        };
        modalFormInputs.addEventListener('animationend', animationEnd);
        console.log(modalFormInputs, modalFormSuccess, data);
    };
    var onCallbackFormSubmit = function(event) {
        event.preventDefault();

        var form = this;
        var buttonSubmit = form.querySelector('button[type=submit]');
        var buttonSubmitSpan = buttonSubmit.getElementsByTagName('span').item(0);
        var data = Utils.serializeJson($(form).serializeArray());
        var message = Utils.textifyJson(data);
        var src = 'https://api.telegram.org/bot' + Globals.botApi + '/sendMessage?chat_id=' + Globals.chatId + '&parse_mode=html&text=' + message;
        var xhttp = new XMLHttpRequest();

        form.classList.add('submitting');
        buttonSubmitSpan.innerHTML = 'Отправляем...';

        var onMessageSend = function() {
            $(form).trigger('message-send',[data]);
        };


        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                onMessageSend();
            }
        };
        xhttp.open("GET", src, true);

        if (Globals.sendOnSubmit) {
            xhttp.send();
        } else {
            setTimeout(onMessageSend, 1500);
        }

        return false;
    };

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
            Utils.growNumber(progressPercent, percentShown, 100, 1000 / (100 - percentShown));
        } else {
            buttonSubmit.setAttribute('disabled','');
            Utils.growNumber(progressPercent, percentShown, percentOld, 1000 / Math.abs(percentOld - percentShown));
        }
    });
    $(callbackForm).on('submit', onCallbackFormSubmit);
    $(callbackFormModal).on('submit', onCallbackFormSubmit);
    $(callbackForm).on('message-send', function(e, data) {
        onEighthSectionFormDataSend(data);
    });
    $(callbackFormModal).on('message-send', function(e, data) {
        onCallbackFormModalDataSend(this, data);
    });

});

