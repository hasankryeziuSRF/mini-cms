(function (global, doc) {
    const SELECTOR_TEMPLATE = '.ezselection-settings-option-value-prototype';
    const SELECTOR_OPTION = '.ezselection-settings-option-value';
    const SELECTOR_OPTIONS_LIST = '.ezselection-settings-option-list';
    const SELECTOR_BTN_REMOVE = '.ezselection-settings-option-remove';
    const SELECTOR_BTN_ADD = '.ezselection-settings-option-add';
    const NUMBER_PLACEHOLDER = /__number__/g;

    [...doc.querySelectorAll('.ezselection-settings.options')].forEach(container => {
        const countExistingOptions = () => container.querySelectorAll(SELECTOR_OPTION).length;
        const findCheckedOptions = () => [...container.querySelectorAll('.ezselection-settings-option-checkbox:checked')];
        const toggleDisableState = () => {
            const disabledState = !!findCheckedOptions().length;
            const methodName = disabledState ? 'removeAttribute' : 'setAttribute';

            container.querySelector(SELECTOR_BTN_REMOVE)[methodName]('disabled', disabledState);
        };
        const addOption = () => {
            const template = container.querySelector(SELECTOR_TEMPLATE).innerHTML;

            container
                .querySelector(SELECTOR_OPTIONS_LIST)
                .insertAdjacentHTML('beforeend', template.replace(NUMBER_PLACEHOLDER, countExistingOptions()));
        };
        const removeOptions = () => {
            findCheckedOptions().forEach(element => element.closest(SELECTOR_OPTION).remove());
            toggleDisableState();
        };

        container.querySelector(SELECTOR_OPTIONS_LIST).addEventListener('click', toggleDisableState, false);
        container.querySelector(SELECTOR_BTN_ADD).addEventListener('click', addOption, false);
        container.querySelector(SELECTOR_BTN_REMOVE).addEventListener('click', removeOptions, false);
    });
})(window, document);

(function (global, doc) {
    const btns = doc.querySelectorAll('.btn--udw-relation-default-location');
    const udwContainer = doc.getElementById('react-udw');
    const token = doc.querySelector('meta[name="CSRF-Token"]').content;
    const siteaccess = doc.querySelector('meta[name="SiteAccess"]').content;
    const closeUDW = () => ReactDOM.unmountComponentAtNode(udwContainer);
    const onConfirm = (btn, items) => {
        closeUDW();

        const locationId = items[0].id;
        const locationName = items[0].ContentInfo.Content.Name;
        const objectRelationListSettingsWrapper = btn.closest('.ezobjectrelationlist-settings');
        const objectRelationSettingsWrapper = btn.closest('.ezobjectrelation-settings');

        if (objectRelationListSettingsWrapper) {
            objectRelationListSettingsWrapper.querySelector(btn.dataset.relationRootInputSelector).value = locationId;
            objectRelationListSettingsWrapper.querySelector(btn.dataset.relationSelectedRootNameSelector).innerHTML = locationName;
        } else {
            objectRelationSettingsWrapper.querySelector(btn.dataset.relationRootInputSelector).value = locationId;
            objectRelationSettingsWrapper.querySelector(btn.dataset.relationSelectedRootNameSelector).innerHTML = locationName;
        }
    };
    const onCancel = () => closeUDW();
    const openUDW = (event) => {
        event.preventDefault();

        global.ReactDOM.render(global.React.createElement(global.eZ.modules.UniversalDiscovery, {
            onConfirm: onConfirm.bind(null, event.currentTarget),
            onCancel,
            confirmLabel: 'Confirm location',
            title: event.currentTarget.dataset.universaldiscoveryTitle,
            multiple: false,
            startingLocationId: window.eZ.adminUiConfig.universalDiscoveryWidget.startingLocationId,
            restInfo: { token, siteaccess }
        }), udwContainer);
    };

    btns.forEach(btn => btn.addEventListener('click', openUDW, false));
})(window, window.document);
