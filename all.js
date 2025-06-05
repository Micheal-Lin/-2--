document.addEventListener('DOMContentLoaded', () => {
  let allData = [];
  let currentData = [];

  // 取得資料
  function fetchAllData() {
    axios.get('https://hexschool.github.io/js-filter-data/data.json')
      .then(response => {
        allData = response.data;
        currentData = [...allData];
        renderTable(currentData);
      })
      .catch(error => {
        console.error(error);
      });
  }
  // 使用 axios 向 API 請求資料。
  // 成功取得資料後，存到 allData，並呼叫 renderTable 把資料顯示在表格上。
  // 若失敗則印出錯誤訊息。

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
  // 根據傳入的資料陣列，產生表格內容。
  // 若沒有資料，顯示「查無資料」。
  // 否則將每一筆資料組成 <tr>，顯示在表格中。

  //用來顯示目前的搜尋關鍵字
  const keywordDisplay = document.getElementById('current-keyword');
  document.querySelector('.search').addEventListener('click', () => {
    const keyword = document.querySelector('#crop').value.trim();
    if (!keyword) {
      currentData = [...allData];
      renderTable(currentData);
      keywordDisplay.textContent = '';
      return;
    }
    currentData = allData.filter(item => item.作物名稱 && item.作物名稱.toLowerCase().includes(keyword.toLowerCase()));
    renderTable(currentData);
    keywordDisplay.textContent = `目前搜尋關鍵字：${keyword}`;
  });

  // 排序
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
        renderTable(currentData);
        return;
    }
    const sorted = [...currentData].sort((a, b) => (Number(b[key]) || 0) - (Number(a[key]) || 0));
    renderTable(sorted);
  }
  // 根據傳入的排序條件，決定要用哪個欄位排序。
  // 將 allData 複製一份並排序（預設由大到小）。
  // 排序後呼叫 renderTable 顯示結果。

  // 桌機版排序下拉
  const desktopSelect = document.querySelector('.form-select');
  if (desktopSelect) {
    desktopSelect.addEventListener('change', function () {
      sortByKey(this.value);
    });
  }

  // 手機版排序下拉
  const mobileSelect = document.getElementById('js-moblie-select');
  if (mobileSelect) {
    mobileSelect.addEventListener('change', function () {
      sortByKey(this.value);
    });
  }
  // 取得手機版排序下拉選單。
  // 當選單變更時，呼叫 sortByKey 進行排序。

  // 分類過濾
  document.querySelectorAll('.button-group button').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      document.querySelector('#crop').value = '';
      if (type === 'all') {
        currentData = [...allData];
      } else {
        currentData = allData.filter(item => item.種類代碼 === type);
      }
      renderTable(currentData);
    });
  });
  // 監聽分類按鈕點擊事件。
  // 點擊時根據 data-type 過濾資料，並渲染表格。

  // 搜尋功能
  document.querySelector('.search').addEventListener('click', () => {
    const keyword = document.querySelector('#crop').value.trim().toLowerCase();
    if (!keyword) {
      currentData = [...allData];
      renderTable(currentData);
      return;
    }
    currentData = allData.filter(item => item.作物名稱 && item.作物名稱.toLowerCase().includes(keyword));
    renderTable(currentData);
  });
  // 監聽搜尋按鈕點擊。
  // 取得輸入框的關鍵字，過濾資料後渲染表格。

  // 排序箭頭
  document.querySelectorAll('.sort-advanced i').forEach(icon => {
    icon.addEventListener('click', () => {
      const priceType = icon.dataset.price;
      const direction = icon.dataset.sort;
      const sorted = [...currentData].sort((a, b) => {
        const valA = Number(a[priceType]) || 0;
        const valB = Number(b[priceType]) || 0;
        return direction === 'up' ? valA - valB : valB - valA;
      });
      renderTable(sorted);
    });
  });
  // 監聽表格標題的排序箭頭。
  // 點擊時根據欄位及方向排序，並渲染表格。

  // 手機版 select 顯示控制
  function toggleSelectByWidth() {
     const desktopSelect = document.querySelector('.form-select');
     const mobileSelect = document.getElementById('js-moblie-select');
     if (window.innerWidth < 768) {
       if (desktopSelect) desktopSelect.style.display = 'none';
      if (mobileSelect) mobileSelect.style.display = 'block';
    } else {
       if (desktopSelect) desktopSelect.style.display = 'block';
      if (mobileSelect) mobileSelect.style.display = 'none';
    }
  }
  window.addEventListener('resize', toggleSelectByWidth);
  document.addEventListener('DOMContentLoaded', toggleSelectByWidth);
    // 根據視窗寬度決定是否顯示手機版 select。
    // 當螢幕寬度小於 768px 顯示，否則隱藏。
    // 監聽視窗尺寸變化即時調整。

  // 綁定 Enter 搜尋
  const cropInput = document.querySelector('#crop');
  if (cropInput) {
    cropInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        document.querySelector('.search').click();
      }
    });
  }

  // 初始載入
  fetchAllData();
  // 一進網頁就抓取資料並顯示。
});