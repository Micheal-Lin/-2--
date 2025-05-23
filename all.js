document.addEventListener('DOMContentLoaded', () => {
    let allData = [];
  
    // 取得資料並渲染
    function fetchAllData() {
      axios.get('https://hexschool.github.io/js-filter-data/data.json')
        .then(response => {
          allData = response.data;
          renderTable(allData);
        })
        .catch(error => {
          console.error(error);
        });
    }
  
    // 渲染表格
    function renderTable(data) {
      const tbody = document.querySelector('.showList');
      if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center p-3">查無資料</td></tr>`;
        return;
      }
      let str = '';
      data.forEach(item => {
        str += `<tr>
          <td>${item.作物名稱 || '-'}</td>
          <td>${item.市場名稱 || '-'}</td>
          <td>${item.上價 || '-'}</td>
          <td>${item.中價 || '-'}</td>
          <td>${item.下價 || '-'}</td>
          <td>${item.平均價 || '-'}</td>
          <td>${item.交易量 || '-'}</td>
        </tr>`;
      });
      tbody.innerHTML = str;
    }
  
    // 共用排序函式
    function sortByKey(value) {
      let key = '';
      switch (value) {
        case '依上價排序':
        case '上價':
          key = '上價'; break;
        case '依中價排序':
        case '中價':
          key = '中價'; break;
        case '依下價排序':
        case '下價':
          key = '下價'; break;
        case '依平均價排序':
        case '平均價':
          key = '平均價'; break;
        case '依交易量排序':
        case '交易量':
          key = '交易量'; break;
        default:
          renderTable(allData);
          return;
      }
      const sorted = [...allData].sort((a, b) => (Number(b[key]) || 0) - (Number(a[key]) || 0));
      renderTable(sorted);
    }
  
    // 桌機版排序下拉選單
    const desktopSelect = document.querySelector('form-select');
    if (desktopSelect) {
      desktopSelect.addEventListener('change', function() {
        sortByKey(this.value);
      });
    }
    
    // 手機版排序下拉選單
    const mobileSelect = document.getElementById('js-moblie-select');
    if (mobileSelect) {
      mobileSelect.addEventListener('change', function() {
        sortByKey(this.value);
      });
    }

  
    // 分類過濾
    document.querySelectorAll('.button-group button').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-type');
        document.querySelector('#crop').value = ''; // 清空搜尋欄
        if (type === 'all') {
          renderTable(allData);
        } else {
          const filtered = allData.filter(item => item.種類代碼 === type);
          renderTable(filtered);
        }
      });
    });
  
    // 搜尋功能
    document.querySelector('.search').addEventListener('click', () => {
      const keyword = document.querySelector('#crop').value.trim().toLowerCase();
      if (!keyword) {
        renderTable(allData);
        return;
      }
      const filtered = allData.filter(item => item.作物名稱 && item.作物名稱.toLowerCase().includes(keyword));
      renderTable(filtered);
    });
  
    // 排序箭頭功能
    document.querySelectorAll('.sort-advanced i').forEach(icon => {
      icon.addEventListener('click', () => {
        const priceType = icon.dataset.price;
        const direction = icon.dataset.sort;
        const sorted = [...allData].sort((a, b) => {
          const valA = Number(a[priceType]) || 0;
          const valB = Number(b[priceType]) || 0;
          return direction === 'up' ? valA - valB : valB - valA;
        });
        renderTable(sorted);
      });
    });
  
    // 手機版 select 顯示控制
    function toggleMobileSelect() {
      if (window.innerWidth < 768) {
        mobileSelect.style.display = 'block';
      } else {
        mobileSelect.style.display = 'none';
      }
    }
    if (mobileSelect) {
      toggleMobileSelect();
      window.addEventListener('resize', toggleMobileSelect);
    }
  
    // 初始載入資料
    fetchAllData();
  });  