(function (global, doc) {
    const toggleForms = [...doc.querySelectorAll('.ez-toggle-btn-state')];

    toggleForms.forEach(toggleForm => {
        const checkboxes = [...toggleForm.querySelectorAll('.ez-checkbox-cell input[type="checkbox"]')];
        const toggleButtonState = () => {
            const methodName = checkboxes.some(el => el.checked) ? 'removeAttribute' : 'setAttribute';
            const buttonRemove = doc.querySelector(toggleForm.dataset.toggleButtonId);

            buttonRemove[methodName]('disabled', true);
        };

        checkboxes.forEach(checkbox => checkbox.addEventListener('change', toggleButtonState, false));
    });
})(window, document);

(function (global, doc, $) {
    $('.ez-tabs a[href="#' + global.location.hash.split('#')[1] + '"]').tab('show');

    // Change hash for page-reload
    $('.ez-tabs a').on('shown.bs.tab', function (e) {
        global.location.hash = e.target.hash + '#tab';
    })
})(window, document, window.jQuery);
