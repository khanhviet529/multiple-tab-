var initializeTabPanel = (tabPanelItems) => {
  DevExpress.setTemplateEngine({
    compile: (element) => $(element).html(),
    render: (template, data) => Mustache.render(template, data),
  });

  const tabPanel = $('#tabpanel-container').dxTabPanel({
    height: 260,
    dataSource: tabPanelItems,
    selectedIndex: 0,
    loop: false,
    animationEnabled: true,
    swipeEnabled: true,
    itemTitleTemplate: $('#title'),
    itemTemplate: $('#customer'),
    onSelectionChanged(e) {
      $('.selected-index')
        .text(e.component.option('selectedIndex') + 1);
    },
  }).dxTabPanel('instance');


  $('.item-count').text(tabPanelItems.length);
};
$(document).ready(function () {
  initializeTabPanel(tabPanelItems);
});


const tableeidt = (tabPanelItems) => {
  let maxID = tabPanelItems[tabPanelItems.length - 1].ID;
  const isChief = (position) => position && ['CEO', 'CMO'].indexOf(position.trim().toUpperCase()) >= 0;

  $('#grid-container').dxDataGrid({
    dataSource: tabPanelItems,
    showBorders: true,
    keyExpr: 'ID',
    paging: {
      enabled: false,
    },
    paging: {
      enabled: true, // Bật phân trang
      pageSize: 5,   // Số hàng trên mỗi trang
    },
    pager: {
      showPageSizeSelector: true, // Hiển thị menu chọn số hàng trên mỗi trang
      allowedPageSizes: [5, 10, 20], // Các tùy chọn số hàng mỗi trang
      showInfo: true,              // Hiển thị thông tin phân trang
    },
    editing: {
      mode: 'row',
      allowUpdating: true,
      allowDeleting(e) {
        return !isChief(e.row.data.Position);
      },
      useIcons: true,
    },
    onRowValidating(e) {
      const position = e.newData.Position;

      if (isChief(position)) {
        e.errorText = `The company can have only one ${position.toUpperCase()}. Please choose another position.`;
        e.isValid = false;
      }
    },
    onEditorPreparing(e) {
      if (e.parentType === 'dataRow' && e.dataField === 'Position') {
        e.editorOptions.readOnly = isChief(e.value);
      }
    },
    // Gọi khi người dùng bắt đầu chỉnh sửa.
    onEditingStart(e) {
      console.log('Editing started for row:', e.data);
    }
    ,
    // Gọi khi người dùng lưu thay đổi trên một dòng.
    onRowUpdating(e) {
      console.log('Row updated:', e.newData);
    },
    // GGọi khi dữ liệu được lưu thành công
    onSaved(e) {
      console.log('Changes saved:', e.changes);
    },
    columns: [
      {
        type: 'buttons',
        width: 110,
        buttons: ['edit', 'delete', {
          hint: 'Clone',
          icon: 'copy',
          visible(e) {
            return !e.row.isEditing;
          },
          disabled(e) {
            return isChief(e.row.data.Position);
          },
          onClick(e) {
            const clonedItem = $.extend({}, e.row.data, { ID: maxID += 1 });

            employees.splice(e.row.rowIndex, 0, clonedItem);
            e.component.refresh(true);
            e.event.preventDefault();
          },
        }],
      },

      'CompanyName',
      'Address',
      'City',
      'State',
      'Zipcode',
      'Phone',
      'Fax',
      'Website',
    ],
  });
};
$(document).ready(function () {
  initializeTabPanel(tabPanelItems);
  const tabpanel_tab = document.querySelectorAll('.dx-tab');

  // console.log(tabpanel_tab);
  tabpanel_tab.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      // const tabpanel_item = document.querySelector('.tabpanel-item');
      const dx_item = document.querySelectorAll('.dx-multiview-item');
      // console.log((dx_item[index].children[0]).children[0]);
      const tabpanel_item = (dx_item[index].children[0]).children[0];
      const demo_container = document.querySelector('.demo-container');
      console.log(demo_container);
      if (demo_container) {
        console.log(demo_container);
        demo_container.remove();
      }
      tabpanel_item.innerHTML = '<div class="demo-container"> <div id="grid-container"></div></div>';
      // tabpanel_item.innerHTML = '<p> ádas </p>';
      tableeidt(tabPanelItems);
      // tabpanel_item.append("<b>Appended text</b>");
    });
  })

  
});

