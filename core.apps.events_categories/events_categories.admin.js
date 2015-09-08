core.apps.events_categories.extendPrototype({


    settingsBlocks: [
        { title: "Misc: ",
          controls: [
            { tag: "a", 
              events: { onclick: "onManageCategoriesClick" },
              innerHTML: "Edit categories" }
          ]}
    ],


    onManageCategoriesClick: function() {
        core.values.events_manager_section = "categories";
        desktop.showPopupApp("events_manager");
    }
   

});