(function () {
    const btns = document.querySelectorAll('.btn--udw-browse');
    const udwContainer = document.getElementById('react-udw');
    const token = document.querySelector('meta[name="CSRF-Token"]').content;
    const siteaccess = document.querySelector('meta[name="SiteAccess"]').content;
    const closeUDW = () => ReactDOM.unmountComponentAtNode(udwContainer);
    const onConfirm = (items) => {
        closeUDW();

        window.location.href = window.Routing.generate('_ezpublishLocation', { locationId: items[0].id });
    };
    const onCancel = () => closeUDW();
    const openUDW = (event) => {
        event.preventDefault();

        ReactDOM.render(React.createElement(eZ.modules.UniversalDiscovery, {
            onConfirm,
            onCancel,
            confirmLabel: 'View content',
            title: 'Browse content',
            multiple: false,
            startingLocationId: parseInt(event.currentTarget.dataset.startingLocationId, 10),
            restInfo: {token, siteaccess}
        }), udwContainer);
    };

    btns.forEach(btn => btn.addEventListener('click', openUDW, false));
})();

(function (global, doc) {
    const btns = doc.querySelectorAll('.ez-btn--cotf-create');
    const udwContainer = doc.getElementById('react-udw');
    const token = doc.querySelector('meta[name="CSRF-Token"]').content;
    const siteaccess = doc.querySelector('meta[name="SiteAccess"]').content;
    const closeUDW = () => ReactDOM.unmountComponentAtNode(udwContainer);
    const onConfirm = (items) => {
        closeUDW();

        window.location.href = window.Routing.generate('_ezpublishLocation', { locationId: items[0].id });
    };
    const onCancel = () => closeUDW();
    const openUDW = (event) => {
        event.preventDefault();

        ReactDOM.render(React.createElement(eZ.modules.UniversalDiscovery, {
            onConfirm,
            onCancel,
            title: 'Create your content',
            activeTab: 'create',
            onlyContentOnTheFly: true,
            multiple: false,
            startingLocationId: global.eZ.adminUiConfig.universalDiscoveryWidget.startingLocationId,
            restInfo: {token, siteaccess}
        }), udwContainer);
    };

    btns.forEach(btn => btn.addEventListener('click', openUDW, false));
})(window, document);

(function (global, doc, $) {
    const FORM_EDIT = 'form.ez-edit-content-form';
    const editVersion = (event) => {
        const versionEditForm = doc.querySelector(FORM_EDIT);
        const versionEditFormName = versionEditForm.name;
        const contentId = event.currentTarget.dataset.contentId;
        const versionNo = event.currentTarget.dataset.versionNo;
        const languageCode = event.currentTarget.dataset.languageCode;
        const contentInfoInput = versionEditForm.querySelector('input[name="' + versionEditFormName + '[content_info]"]');
        const versionInfoContentInfoInput = versionEditForm.querySelector('input[name="' + versionEditFormName+ '[version_info][content_info]"]');
        const versionInfoVersionNoInput = versionEditForm.querySelector('input[name="' + versionEditFormName + '[version_info][version_no]"]');
        const languageInput = versionEditForm.querySelector('#'+ versionEditFormName +'_language_' + languageCode);
        const checkVersionDraftLink = global.Routing.generate('ezplatform.version_draft.has_no_conflict', { contentId });
        const submitVersionEditForm = () => {
            contentInfoInput.value = contentId;
            versionInfoContentInfoInput.value = contentId;
            versionInfoVersionNoInput.value = versionNo;
            languageInput.setAttribute('checked', true);
            versionEditForm.submit();
        };
        const addDraft = () => {
            submitVersionEditForm();
            $('#version-draft-conflict-modal').modal('hide');
        };
        const showModal = (modalHtml) => {
            const wrapper = doc.querySelector('.ez-modal-wrapper');

            wrapper.innerHTML = modalHtml;
            wrapper.querySelector('.ez-btn--add-draft').addEventListener('click', addDraft, false);
            [...wrapper.querySelectorAll('.ez-btn--prevented')].forEach(btn => btn.addEventListener('click', event => event.preventDefault(), false));
            $('#version-draft-conflict-modal').modal('show');
        };

        event.preventDefault();

        fetch(checkVersionDraftLink, {
            credentials: 'same-origin'
        }).then(function (response) {
            // Status 409 means that a draft conflict has occurred and the modal must be displayed.
            // Otherwise we can go to Content Item edit page.
            if (response.status === 409) {
                response.text().then(showModal);
            } else if (response.status === 200) {
                submitVersionEditForm();
            }
        });
    };

    [...doc.querySelectorAll('.ez-btn--content-edit')].forEach(button => button.addEventListener('click', editVersion, false));
})(window, document, window.jQuery);

(function (global, doc, $) {
    const editVersion = (event) => {
        const contentDraftEditUrl = event.currentTarget.dataset.contentDraftEditUrl;
        const versionHasConflictUrl = event.currentTarget.dataset.versionHasConflictUrl;

        event.preventDefault();

        fetch(versionHasConflictUrl, {
            credentials: 'same-origin'
        }).then(function (response) {
            if (response.status === 409) {
                doc.querySelector('#edit-conflicted-draft').href = contentDraftEditUrl;
                $('#version-conflict-modal').modal('show');
            }
            if (response.status === 200) {
                global.location.href = contentDraftEditUrl;
            }
        })
    };

    [...doc.querySelectorAll('.ez-btn--content-draft-edit')].forEach(link => link.addEventListener('click', editVersion, false));
})(window, document, window.jQuery);
