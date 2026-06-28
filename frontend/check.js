const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.stack));
  
  try {
    await page.goto('http://localhost:3000/index.html');
    await page.evaluate(() => {
      sessionStorage.setItem('obe_session', JSON.stringify({id: 'usr-vw', name: 'Vaishali Wangikar', role: 'faculty'}));
    });
    
    await page.goto('http://localhost:3000/faculty/courses.html');
    await new Promise(r => setTimeout(r, 2000));
    
    await page.evaluate(() => {
      console.log('Attempting to click Add Course...');
      const btns = Array.from(document.querySelectorAll('button'));
      const addBtn = btns.find(b => b.textContent.includes('Add Your First Course'));
      if (addBtn) addBtn.click();
      else {
        // try edit
        const editBtn = btns.find(b => b.textContent.includes('✏️'));
        if (editBtn) editBtn.click();
      }
    });
    
    await new Promise(r => setTimeout(r, 1000));
  } catch (e) {
    console.error("Test Script Error:", e);
  } finally {
    await browser.close();
  }
})();
