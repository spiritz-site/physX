// ================== COIN SYSTEM ==================
    function getCoins() {
      try { return parseInt(localStorage.getItem('physx_coins') || "50"); }
      catch { return 50; }
    }
    function setCoins(val) {
      try { localStorage.setItem('physx_coins', String(val)); }
      catch {}
      updateCoinDisplay();
    }
    function addCoins(amount, reason = "") {
      const current = getCoins();
      const next = current + amount;
      setCoins(next);
      
      const display = document.getElementById("coinCount");
      if (display) {
        display.classList.add("coin-pop");
        setTimeout(() => display.classList.remove("coin-pop"), 600);
      }
      
      if (reason) {
        addNotification("coin", `+${amount} ⚡`, reason, "Жаңа ғана");
      }
      
      showToast(`+${amount} джоуль! 🎉`, '⚡');
    }
    function updateCoinDisplay() {
      const coins = getCoins();
      document.getElementById("coinCount").textContent = `⚡ ${coins}`;
      ["shopCoins", "profileCoins", "sidebarCoins"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = coins;
      });
    }
    
    // ================== NOTIFICATIONS ==================
    function getNotifications() {
      try { return JSON.parse(localStorage.getItem('physx_notifs') || "[]"); }
      catch { return []; }
    }
    function saveNotifications(arr) {
      try { localStorage.setItem('physx_notifs', JSON.stringify(arr)); }
      catch {}
    }
    function addNotification(type, title, text, time = "Жаңа") {
      const notifs = getNotifications();
      notifs.unshift({ type, title, text, time, id: Date.now() });
      if (notifs.length > 20) notifs.pop();
      saveNotifications(notifs);
      renderNotifications();
      showNotifBadge();
    }
    function renderNotifications() {
      const list = document.getElementById("notifList");
      if (!list) return;
      const notifs = getNotifications();
      if (notifs.length === 0) {
        list.innerHTML = `<div style="text-align: center; padding: 40px 20px; opacity: 0.5;">
          <div class="txt-sm">Хабарландырулар жоқ</div>
        </div>`;
        return;
      }
      const icons = { coin: "⚡", achievement: "🏆", course: "📚" };
      list.innerHTML = notifs.map(n => `
        <div class="notif-item" onclick="clearNotification(${n.id})">
          <div class="notif-icon ${n.type}">${icons[n.type] || "📢"}</div>
          <div class="notif-content">
            <div class="notif-title">${n.title}</div>
            <div class="notif-text">${n.text}</div>
            <div class="notif-time">${n.time}</div>
          </div>
        </div>
      `).join("");
    }
    function clearNotification(id) {
      const notifs = getNotifications().filter(n => n.id !== id);
      saveNotifications(notifs);
      renderNotifications();
      if (notifs.length === 0) hideNotifBadge();
    }
    function clearNotifications() {
      saveNotifications([]);
      renderNotifications();
      hideNotifBadge();
      showToast("Барлық хабарландырулар тазартылды", '✓');
    }
    function toggleNotifications() {
      const panel = document.getElementById("notifPanel");
      panel.classList.toggle("active");
      if (panel.classList.contains("active")) {
        hideNotifBadge();
      }
    }
    function showNotifBadge() {
      const badge = document.getElementById("notifBadge");
      if (badge) badge.style.display = "block";
    }
    function hideNotifBadge() {
      const badge = document.getElementById("notifBadge");
      if (badge) badge.style.display = "none";
    }
    
    document.addEventListener("click", (e) => {
      const panel = document.getElementById("notifPanel");
      const notifBtn = e.target.closest(".menu-btn");
      if (!panel.contains(e.target) && !notifBtn) {
        panel.classList.remove("active");
      }
    });
    
    // ================== COURSE CONTENT ==================
    const COURSE_CONTENT = {
      kinematics: {
        title: "Кинематика",
        level: "8-сынып",
        videoId: "bMzZAZ6ozVQ",
        sections: [
          {
            title: "Кинематика дегеніміз не?",
            content: "Кинематика — механиканың дененің қозғалысын сипаттайтын бөлімі. Ол қозғалыстың себебін емес, қозғалыстың өзін зерттейді. Кинематикада біз дененің орын ауыстыруын, жылдамдығын және үдеуін зерттейміз.",
            image: "https://via.placeholder.com/600x300/1a3235/00f2a0?text=Kinematics"
          },
          {
            title: "Негізгі ұғымдар",
            content: "Материалдық нүкте, траектория, жол, орын ауыстыру — кинематиканың негізгі ұғымдары. Материалдық нүкте деп өлшемдерін ескермеуге болатын денені айтамыз. Траектория — дененің қозғалыс жолы. Жол — траектория бойынша өткен қашықтық.",
            formula: "s = vt"
          },
          {
            title: "Қозғалыс түрлері",
            content: "Бірқалыпты және айнымалы қозғалыс. Бірқалыпты қозғалыс кезінде жылдамдық тұрақты болады. Айнымалы қозғалыс кезінде жылдамдық өзгереді. Үдемелі қозғалыста үдеу тұрақты болады.",
            formula: "v = v₀ + at",
            example: {
              title: "Мысал:",
              content: "Егер автомобиль 60 км/сағ жылдамдықпен 2 сағат жүрсе, ол қанша жол жүреді? Шешуі: s = vt = 60 × 2 = 120 км"
            }
          }
        ]
      },
      electricity: {
        title: "Электр тогы",
        level: "8-сынып",
        videoId: "5XTauNV7fWY",
        sections: [
          {
            title: "Электр тогы дегеніміз не?",
            content: "Электр тогы — электр зарядтарының бағытталған қозғалысы. Ток күші амперметрмен өлшенеді және Ампермен (А) көрсетіледі. Металдарда оң зарядталған иондар және еркін электрондар бар.",
            image: "https://via.placeholder.com/600x300/1a3235/00f2a0?text=Electric+Current"
          },
          {
            title: "Ом заңы",
            content: "Ом заңы бойынша, ток күші кернеуге тура пропорционал және кедергіге кері пропорционал. Бұл заң электр тізбектерін есептеуде өте маңызды.",
            formula: "I = U / R"
          },
          {
            title: "Электр тогының жұмысы және қуаты",
            content: "Электр тогының жұмысы заряд пен кернеудің көбейтіндісіне тең. Қуат — бірлік уақыттағы жұмыс. Қуат ватпен (Вт) өлшенеді.",
            formula: "A = UIt, P = UI",
            example: {
              title: "Мысал:",
              content: "220 В кернеуде 2 А ток жүретін лампаның қуаты: P = UI = 220 × 2 = 440 Вт"
            }
          }
        ]
      },
      // PREMIUM COURSES
      optics: {
        title: "Оптика (Премиум)",
        level: "8-9 сынып",
        videoId: "KKr7PfWp0mE",
        isPremium: true,
        sections: [
          {
            title: "Жарық табиғаты",
            content: "Жарық — электромагниттік толқын. Жарық вакуумда 300,000 км/с жылдамдықпен таралады. Жарық корпускулалық-толқындық қасиеттерге ие.",
            image: "https://via.placeholder.com/600x300/1a3235/9D00FF?text=Light+Nature"
          },
          {
            title: "Жарық сынуы заңы",
            content: "Жарық бір ортадан екіншіге өткенде бағытын өзгертеді. Сыну көрсеткіші — ортаның оптикалық тығыздығының көрсеткіші.",
            formula: "n₁ sin α₁ = n₂ sin α₂"
          },
          {
            title: "Линзалар және көру құралдары",
            content: "Жинағыш және шашыратқыш линзалар. Фокус қашықтығы мен оптикалық күш. Микроскоптар мен телескоптардың жұмыс принципі.",
            formula: "D = 1/F (диоптриялар)",
            example: {
              title: "Мысал:",
              content: "Фокус қашықтығы 25 см линзаның оптикалық күші: D = 1/0.25 = 4 диоптрия"
            }
          },
          {
            title: "3D Симуляциялар",
            content: "Интерактивті 3D симуляциялар арқылы жарық сәулелерінің жолын және линзалардан өту процесін көруге болады. Виртуалды зертханада тәжірибелер жасаңыз!"
          }
        ]
      },
      thermodynamics: {
        title: "Термодинамика (Премиум)",
        level: "9-10 сынып",
        videoId: "o-UMszVbrPk",
        isPremium: true,
        sections: [
          {
            title: "Термодинамиканың бірінші заңы",
            content: "Энергияның сақталу заңы — энергия жоғалмайды және жаңадан пайда болмайды, тек бір түрден екінші түрге ауысады. Жүйеге берілген жылу жұмысқа және ішкі энергияның өзгерісіне жұмсалады.",
            formula: "Q = ΔU + A",
            image: "https://via.placeholder.com/600x300/1a3235/9D00FF?text=Thermodynamics"
          },
          {
            title: "Карно циклі",
            content: "Карно циклі — термодинамикалық цикл, ең жоғары ПӘК беретін идеал цикл. Екі изотермалық және екі адиабаттық процестен тұрады.",
            formula: "η = (T₁ - T₂) / T₁",
            example: {
              title: "Мысал:",
              content: "Қыздырғыш температурасы 400K, суытқыш 300K болса, максималды ПӘК: η = (400-300)/400 = 25%"
            }
          },
          {
            title: "Энтропия",
            content: "Энтропия — жүйенің бейберекеттілігін сипаттайтын шама. Термодинамиканың екінші заңы бойынша жабық жүйеде энтропия өседі немесе тұрақты болады.",
            formula: "ΔS ≥ 0"
          }
        ]
      },
      mechanics: {
        title: "Механика (Премиум)",
        level: "9-10 сынып",
        videoId: "b1yJ6A_0cP0",
        isPremium: true,
        sections: [
          {
            title: "Ньютонның қозғалыс заңдары",
            content: "Бірінші заң (инерция заңы): Дене өзіне әсер етуші күштердің қорытқысы нөлге тең болса, тыныштық күйін немесе бірқалыпты түзу сызықты қозғалысын сақтайды.",
            image: "https://via.placeholder.com/600x300/1a3235/9D00FF?text=Newton+Laws"
          },
          {
            title: "Екінші заң",
            content: "Күш дене массасының үдеуіне көбейтіндісіне тең және үдеу бағытымен бағыттас.",
            formula: "F = ma"
          },
          {
            title: "Үшінші заң",
            content: "Әрекет пен қарсы әрекет күштері тең және қарама-қарсы бағытталған.",
            formula: "F₁₂ = -F₂₁",
            example: {
              title: "Мысал:",
              content: "2 кг массалы дене 5 м/с² үдеумен қозғалса, оған әсер етуші күш: F = 2 × 5 = 10 Н"
            }
          },
          {
            title: "Импульс және оның сақталуы",
            content: "Импульс — дене массасының жылдамдығына көбейтіндісі. Жабық жүйеде импульс сақталады.",
            formula: "p = mv, Σp = const"
          }
        ]
      },
      quantum: {
        title: "Квант физикасы (Премиум)",
        level: "11 сынып",
        videoId: "7kb1VT4gPnw",
        isPremium: true,
        sections: [
          {
            title: "Квант физикасына кіріспе",
            content: "Квант физикасы — микродүниені (атомдар, электрондар, фотондар) зерттейтін физика бөлімі. Макро әлемнен мүлдем өзгеше заңдар әрекет етеді.",
            image: "https://via.placeholder.com/600x300/1a3235/9D00FF?text=Quantum+Physics"
          },
          {
            title: "Планк формуласы",
            content: "Макс Планк энергияның дискретті порцияларға (кванттарға) бөлінетінін ашты. Фотон энергиясы оның жиілігіне пропорционал.",
            formula: "E = hν = ℏω"
          },
          {
            title: "Гейзенбергтің белгісіздік принципі",
            content: "Бөлшектің орнын және импульсін бір мезгілде дәл өлшеу мүмкін емес. Бұл өлшеудің дәлсіздігінен емес, табиғаттың қасиетінен туындайды.",
            formula: "Δx · Δp ≥ ℏ/2"
          },
          {
            title: "Шрёдингер теңдеуі",
            content: "Квант механикасының негізгі теңдеуі. Толқындық функцияның уақыт бойынша эволюциясын сипаттайды.",
            example: {
              title: "Қолданылуы:",
              content: "Атомдардағы электрондардың энергетикалық деңгейлерін, химиялық байланыстарды және көптеген квант құбылыстарды түсіндіреді."
            }
          }
        ]
      }
    };
    
    function openTopic(topicId) {
      const content = COURSE_CONTENT[topicId];
      if (!content) {
        showToast('Курс әзірленуде...', '🚧');
        return;
      }
      
      // Check if this is a premium course that needs to be purchased
      if (content.isPremium) {
        const purchases = getPurchases();
        const premiumItem = Object.entries(PREMIUM_COURSES).find(([_, course]) => course.topicId === topicId);
        
        if (premiumItem && !purchases.includes(premiumItem[0])) {
          showToast('Бұл премиум курс! Дүкеннен сатып алыңыз 🔒', '⭐');
          setTimeout(() => setTab('shop'), 1500);
          return;
        }
      }
      
      document.getElementById("courseTitle").textContent = content.title;
      document.getElementById("courseLevel").textContent = content.level;
      
      let bodyHTML = '';
      content.sections.forEach(section => {
        bodyHTML += `<div class="theory-section">`;
        bodyHTML += `<h3>${section.title}</h3>`;
        bodyHTML += `<p>${section.content}</p>`;
        
        if (section.image) {
          bodyHTML += `<img src="${section.image}" class="theory-img" alt="${section.title}" />`;
        }
        
        if (section.formula) {
          bodyHTML += `<div class="formula-box">${section.formula}</div>`;
        }
        
        if (section.example) {
          bodyHTML += `
            <div class="example-box">
              <h4>${section.example.title}</h4>
              <p style="font-size: 13px; line-height: 1.6; color: var(--text-sec);">${section.example.content}</p>
            </div>
          `;
        }
        
        bodyHTML += `</div>`;
      });
      
      document.getElementById("courseBodyContent").innerHTML = bodyHTML;
      document.getElementById("videoPlayer").innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${content.videoId}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
      
      document.getElementById("courseModal").classList.add("active");

      // Lock background scroll + set accessibility state + start from top
      document.body.classList.add("modal-open");
      const _cm = document.getElementById("courseModal");
      _cm?.setAttribute("aria-hidden", "false");
      const _win = _cm?.querySelector(".course-content-window");
      if (_win) _win.scrollTop = 0;
      
      const coinReward = content.isPremium ? 20 : 15;
      addCoins(coinReward, content.isPremium ? "Премиум тақырып ашылды" : "Жаңа тақырып ашылды");
      showAchievement("Зерттеуші! 🔬", `"${content.title}" курсын ашып көрдіңіз`);
    }
    
    function closeCourseModal() {
      const modal = document.getElementById("courseModal");
      modal?.classList.remove("active");
      modal?.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");

      // Stop video playback (prevents audio in background)
      const vp = document.getElementById("videoPlayer");
      if (vp) vp.innerHTML = "";
    }
    
    document.getElementById("courseModal")?.addEventListener("click", (e) => {
      if (e.target.id === "courseModal") closeCourseModal();
    });

    // Close course modal with Escape (desktop UX)
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const modal = document.getElementById("courseModal");
      if (modal?.classList.contains("active")) closeCourseModal();
    });
    
    // Achievement popup
    function showAchievement(title, desc) {
      const popup = document.getElementById("achievementPopup");
      document.getElementById("achievementTitle").textContent = title;
      document.getElementById("achievementDesc").textContent = desc;
      popup.classList.add("show");
      setTimeout(() => popup.classList.remove("show"), 4000);
      
      // Add to notifications too
      addNotification("achievement", title, desc, "Дәл қазір");
    }
    
    // ================== SHOP ==================
    const SHOP_ITEMS = [
      { id: "premium-opt", title: "Премиум Оптика курсы", icon: "🔬", price: 120, desc: "3D симуляциялар", unlocks: "optics" },
      { id: "premium-thermo", title: "Премиум Термодинамика", icon: "🌡️", price: 180, desc: "Тереңдетілген курс", unlocks: "thermodynamics" },
      { id: "premium-mech", title: "Премиум Механика курсы", icon: "⚙️", price: 100, desc: "Толық HD видео дәрістер", unlocks: "mechanics" },
      { id: "premium-quantum", title: "Квант физикасы", icon: "⚛️", price: 250, desc: "Заманауи физика", unlocks: "quantum" },
      { id: "vip-tutor", title: "VIP Тьютор қолдау", icon: "👨‍🏫", price: 300, desc: "Жеке оқытушымен 1-1 сабақтар", unlocks: null },
      { id: "exam-prep", title: "ҰБТ дайындық пакеті", icon: "📝", price: 200, desc: "500+ тест сұрақтары", unlocks: null }
    ];
    
    let pendingPurchase = null;
    
    function getPurchases() {
      try { return JSON.parse(localStorage.getItem('physx_purchases') || "[]"); }
      catch { return []; }
    }
    function savePurchases(arr) {
      try { localStorage.setItem('physx_purchases', JSON.stringify(arr)); }
      catch {}
    }
    function isPurchased(itemId) {
      return getPurchases().includes(itemId);
    }
    function showPurchaseConfirm(itemId, price, title) {
      console.log('showPurchaseConfirm called:', { itemId, price, title });
      const coins = getCoins();
      console.log('Current coins:', coins);
      
      if (coins < price) {
        showToast("Жеткіліксіз джоуль! 😢", '❌');
        return;
      }
      if (isPurchased(itemId)) {
        showToast("Сіз бұны әлдеқашан сатып алдыңыз!", 'ℹ️');
        return;
      }
      
      pendingPurchase = { itemId, price, title };
      console.log('Pending purchase set:', pendingPurchase);
      
      document.getElementById("confirmTitle").textContent = title;
      document.getElementById("confirmText").textContent = `Бағасы: ${price} ⚡`;
      document.getElementById("confirmModal").classList.add("active");
      console.log('Confirm modal should be visible now');
    }
    function closeConfirm() {
      console.log('closeConfirm called');
      document.getElementById("confirmModal").classList.remove("active");
      pendingPurchase = null;
    }
    function confirmPurchase() {
      console.log('confirmPurchase called, pendingPurchase:', pendingPurchase);
      if (!pendingPurchase) return;
      
      const { itemId, price, title } = pendingPurchase;
      const coins = getCoins();
      
      console.log('Processing purchase:', { itemId, price, title, coins });
      
      setCoins(coins - price);
      const purchases = getPurchases();
      purchases.push(itemId);
      savePurchases(purchases);
      
      console.log('Purchase saved. New purchases:', purchases);
      
      addNotification("achievement", "Жаңа курс! 🎉", `"${title}" сатып алынды`, "Дәл қазір");
      renderShop();
      renderCourses(""); // Refresh courses to show new premium course
      updateHomeTopics(); // Refresh home page topics
      closeConfirm();
      showToast(`"${title}" сатып алынды!`, '🎉');
      showAchievement("Инвестор! 💰", `"${title}" сатып алдыңыз`);
      
      // Unlock topic on home page
      const item = SHOP_ITEMS.find(i => i.id === itemId);
      if (item && item.unlocks) {
        unlockTopic(item.unlocks);
      }
      
      // Show notification that course is now in Courses section
      setTimeout(() => {
        showToast('Курс "Курстар" бөлімінде қол жетімді! 📚', '✨');
      }, 2000);
      
      // Switch to home tab and show notification about unlocked topic
      setTimeout(() => {
        setTab('home');
        showToast('Басты беттегі тақырып ашылды! 🎯', '🔓');
      }, 4000);
    }
    
    function unlockTopic(topicId) {
      // Remove locked class from corresponding card on home page
      const cards = document.querySelectorAll('.sub-card');
      cards.forEach(card => {
        const onclick = card.getAttribute('onclick');
        if (onclick && onclick.includes(topicId)) {
          card.classList.remove('locked');
          // Update onclick to open the topic instead of showing locked message
          card.setAttribute('onclick', `openTopic('${topicId}')`);
          
          // Visual feedback - animate the unlock
          card.style.transition = 'all 0.5s ease';
          card.style.transform = 'scale(1.1)';
          setTimeout(() => {
            card.style.transform = 'scale(1)';
          }, 300);
        }
      });
    }
    
    function updateHomeTopics() {
      // Re-render all topic cards based on purchases
      const purchases = getPurchases();
      const topicsGrid = document.getElementById('topicsGrid');
      if (!topicsGrid) return;
      
      // Define all topics with their unlock requirements
      const topics = [
        { id: 'kinematics', emoji: '🏃', title: 'Кинематика', unlocked: true },
        { id: 'electricity', emoji: '⚡', title: 'Электр', unlocked: true },
        { id: 'optics', emoji: '🔬', title: 'Оптика', unlockKey: 'premium-opt' },
        { id: 'thermodynamics', emoji: '🌡️', title: 'Термодинамика', unlockKey: 'premium-thermo' },
        { id: 'mechanics', emoji: '⚙️', title: 'Механика', unlockKey: 'premium-mech' },
        { id: 'quantum', emoji: '⚛️', title: 'Квант', unlockKey: 'premium-quantum' }
      ];
      
      topicsGrid.innerHTML = topics.map(topic => {
        const isUnlocked = topic.unlocked || (topic.unlockKey && purchases.includes(topic.unlockKey));
        const isPremiumUnlocked = topic.unlockKey && isUnlocked && !topic.unlocked;
        const lockedClass = isUnlocked ? '' : 'locked';
        const premiumClass = isPremiumUnlocked ? 'premium-unlocked' : '';
        const onclick = isUnlocked 
          ? `openTopic('${topic.id}')`
          : `showToast('${topic.title} курсын сатып алыңыз!', '🔒')`;
        
        // Add premium badge for unlocked premium topics
        const premiumBadge = isPremiumUnlocked
          ? '<div style="position: absolute; top: 8px; right: 8px; background: var(--purple); border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 12px; z-index: 2;">⭐</div>' 
          : '';
        
        return `
          <div class="sub-card ${lockedClass} ${premiumClass}" onclick="${onclick}" style="position: relative;">
            ${premiumBadge}
            <span class="topic-emoji">${topic.emoji}</span>
            <div class="txt-xs" style="position: relative; z-index: 1;">${topic.title}</div>
          </div>
        `;
      }).join('');
      
      // Animate newly unlocked cards
      setTimeout(() => {
        const unlockedCards = topicsGrid.querySelectorAll('.sub-card:not(.locked)');
        unlockedCards.forEach((card, index) => {
          if (index >= 2) { // Skip the first 2 (always unlocked)
            card.style.animation = 'bounce 0.6s ease-out';
          }
        });
      }, 100);
    }
    
    function renderShop() {
      const root = document.getElementById("shopItems");
      if (!root) return;
      const coins = getCoins();
      
      console.log('renderShop called, coins:', coins);
      
      root.innerHTML = SHOP_ITEMS.map(item => {
        const owned = isPurchased(item.id);
        const canAfford = coins >= item.price;
        const locked = !owned && !canAfford;
        
        console.log(`Item ${item.id}: owned=${owned}, canAfford=${canAfford}, locked=${locked}`);
        
        return `
          <div class="shop-item premium ${locked ? 'locked' : ''}" 
               data-item-id="${item.id}"
               data-price="${item.price}"
               data-title="${item.title}"
               ${!owned && canAfford ? `style="cursor: pointer;"` : ''}>
            <div class="shop-icon">${item.icon}</div>
            <div class="shop-content">
              <div class="h3" style="font-size: 14px; margin-bottom: 2px;">${item.title}</div>
              <div class="txt-sm">${item.desc}</div>
            </div>
            <div class="shop-price ${owned ? 'owned' : ''}">
              ${owned ? '✓ Сатып алынды' : `<span style="font-size: 18px;">⚡</span> ${item.price}`}
            </div>
          </div>
        `;
      }).join("");
      
      // Add click handlers after rendering
      const shopItems = document.querySelectorAll('.shop-item');
      console.log('Found shop items:', shopItems.length);
      
      shopItems.forEach(el => {
        const itemId = el.dataset.itemId;
        const owned = isPurchased(itemId);
        const canAfford = coins >= parseInt(el.dataset.price);
        
        console.log(`Adding handler for ${itemId}: owned=${owned}, canAfford=${canAfford}`);
        
        if (!owned && canAfford) {
          el.style.cursor = 'pointer';
          el.addEventListener('click', (e) => {
            console.log('Shop item clicked:', itemId);
            const price = parseInt(el.dataset.price);
            const title = el.dataset.title;
            showPurchaseConfirm(itemId, price, title);
          });
        } else if (!owned && !canAfford) {
          el.addEventListener('click', () => {
            showToast("Жеткіліксіз джоуль! 😢", '❌');
          });
        } else if (owned) {
          el.style.cursor = 'default';
          el.addEventListener('click', () => {
            showToast("Сіз бұны әлдеқашан сатып алдыңыз!", 'ℹ️');
          });
        }
      });
      
      console.log('Shop rendering complete');
    }
    
    // ================== TABS ==================
    function setTab(tabName) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
      document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
      document.getElementById('tab-' + tabName).classList.add('active');
      const map = {
        home: 'nav-home',
        chat: 'nav-chat',
        courses: 'nav-courses',
        shop: 'nav-shop',
        profile: 'nav-profile'
      };
      if (map[tabName] && document.getElementById(map[tabName])) {
        document.getElementById(map[tabName]).classList.add('active');
      }
      
      // Update home topics when switching to home tab
      if (tabName === 'home') {
        updateHomeTopics();
      }
      
      try { localStorage.setItem('physx_active_tab', tabName); } catch(e) {}
      window.scrollTo(0, 0);
    }
    function toggleMenu() {
      document.getElementById('sidebar').classList.toggle('active');
      document.getElementById('overlay').classList.toggle('active');
    }
    function showToast(msg, icon = '✓') {
      const btn = document.querySelector('.nav-fab');
      const original = btn.innerHTML;
      btn.style.background = 'var(--success)';
      btn.innerHTML = '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = 'var(--text-main)';
      }, 1500);
      
      const t = document.getElementById('toast');
      const tIcon = document.getElementById('toastIcon');
      const tText = document.getElementById('toastText');
      if (t) {
        tIcon.textContent = icon;
        tText.textContent = msg;
        t.classList.add('show');
        clearTimeout(window.__toastTimer);
        window.__toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
      }
    }
    function startLesson() {
      openTopic('electricity');
    }
    function primaryAction() {
      showAchievement("Тапсырма қосылды! ✅", "Жаңа тапсырма тізімге қосылды");
      addCoins(5, "Белсенділік көрсеттіңіз");
    }
    setTimeout(() => {
      const fill = document.querySelector('.prog-fill');
      if (fill) fill.style.width = '62%';
    }, 500);
    
    // ================== CHAT ==================
    const API_KEY = "AIzaSyAD9hW22ophF6fCIOa_7CPAiM6fIap-ye8";
    const MODEL = "gemini-2.0-flash-exp";
    const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;
    const systemInstruction = {
      role: "user",
      parts: [{
        text: "Сен физика пәнінің мұғалімісің. Қысқа әрі нақты жауап бер. Формулаларды LaTeX форматында (мысалы $E=mc^2$ немесе $$...$$) жаз. Қазақша сөйле. Ешқашан оқушыға есепті шығарып берме, тек шығарылу жолын түсіндір"
      }]
    };
    let chatHistory = [
      { role: "model", parts: [{ text: "Сәлем! Физикадан сұрағыңды жаз — қысқа әрі нақты жауап беремін." }] }
    ];
    
    function formatText(text) {
      return String(text || "")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/\*(.*?)\*/g, "<i>$1</i>")
        .replace(/\n/g, "<br>");
    }
    
    async function sendMessage() {
      const input = document.getElementById('chatInput');
      const container = document.getElementById('chatContainer');
      const sendBtn = document.getElementById('sendBtn');
      const text = input.value.trim();
      if (!text) return;
      
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-bubble chat-user';
      userMsg.innerText = text;
      container.appendChild(userMsg);
      input.value = '';
      input.disabled = true;
      sendBtn.disabled = true;
      container.scrollTop = container.scrollHeight;
      
      chatHistory.push({ role: "user", parts: [{ text }] });
      
      const loadingId = 'loading-' + Date.now();
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chat-bubble chat-ai';
      loadingMsg.id = loadingId;
      loadingMsg.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
      container.appendChild(loadingMsg);
      container.scrollTop = container.scrollHeight;
      
      try {
        const body = { systemInstruction, contents: chatHistory };
        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) {
          const msg = data?.error?.message || `HTTP ${response.status}`;
          throw new Error(msg);
        }
        const aiText =
          data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ||
          "Жауап бос қайтты. Қайта сұрап көр.";
        chatHistory.push({ role: "model", parts: [{ text: aiText }] });
        
        const bubble = document.getElementById(loadingId);
        bubble.innerHTML = formatText(aiText);
        
        addCoins(5, "AI-мен сөйлестіңіз");
        
        if (window.renderMathInElement) {
          renderMathInElement(bubble, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
              { left: "\\(", right: "\\)", display: false },
              { left: "\\[", right: "\\]", display: true }
            ],
            throwOnError: false
          });
        }
      } catch (err) {
        console.error(err);
        const bubble = document.getElementById(loadingId);
        bubble.innerHTML = `<span style="color:var(--danger); font-size:13px;">Қате: ${err.message}</span>`;
      } finally {
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
        container.scrollTop = container.scrollHeight;
      }
    }
    
    document.addEventListener("keydown", (e) => {
      const activeChat = document.getElementById("tab-chat")?.classList.contains("active");
      if (!activeChat) return;
      if (e.key === "Enter") {
        const input = document.getElementById("chatInput");
        if (document.activeElement === input) sendMessage();
      }
    });
    
    // ================== FLOATING CHAT ==================
    let floatChatHistory = [
      { role: "model", parts: [{ text: "Сәлем! Физикадан сұрағыңды жаз." }] }
    ];
    
    function openFloatChat() {
      const modal = document.getElementById("floatChatModal");
      modal.classList.add("active");
      setTimeout(() => {
        document.getElementById("floatChatInput")?.focus();
      }, 300);
    }
    function closeFloatChat() {
      document.getElementById("floatChatModal").classList.remove("active");
    }
    
    async function sendFloatMessage() {
      const input = document.getElementById('floatChatInput');
      const container = document.getElementById('floatChatBody');
      const text = input.value.trim();
      if (!text) return;
      
      const userMsg = document.createElement('div');
      userMsg.className = 'chat-bubble chat-user';
      userMsg.innerText = text;
      container.appendChild(userMsg);
      input.value = '';
      input.disabled = true;
      container.scrollTop = container.scrollHeight;
      
      floatChatHistory.push({ role: "user", parts: [{ text }] });
      
      const loadingId = 'float-loading-' + Date.now();
      const loadingMsg = document.createElement('div');
      loadingMsg.className = 'chat-bubble chat-ai';
      loadingMsg.id = loadingId;
      loadingMsg.innerHTML = '<span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>';
      container.appendChild(loadingMsg);
      container.scrollTop = container.scrollHeight;
      
      try {
        const body = { systemInstruction, contents: floatChatHistory };
        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) {
          const msg = data?.error?.message || `HTTP ${response.status}`;
          throw new Error(msg);
        }
        const aiText =
          data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("") ||
          "Жауап бос қайтты.";
        floatChatHistory.push({ role: "model", parts: [{ text: aiText }] });
        
        const bubble = document.getElementById(loadingId);
        bubble.innerHTML = formatText(aiText);
        
        addCoins(5, "Floating чатпен сөйлестіңіз");
        
        if (window.renderMathInElement) {
          renderMathInElement(bubble, {
            delimiters: [
              { left: "$$", right: "$$", display: true },
              { left: "$", right: "$", display: false },
              { left: "\\(", right: "\\)", display: false },
              { left: "\\[", right: "\\]", display: true }
            ],
            throwOnError: false
          });
        }
      } catch (err) {
        console.error(err);
        const bubble = document.getElementById(loadingId);
        bubble.innerHTML = `<span style="color:var(--danger); font-size:13px;">Қате: ${err.message}</span>`;
      } finally {
        input.disabled = false;
        input.focus();
        container.scrollTop = container.scrollHeight;
      }
    }
    
    document.getElementById("floatChatInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendFloatMessage();
    });
    
    document.getElementById("floatChatModal")?.addEventListener("click", (e) => {
      if (e.target.id === "floatChatModal") closeFloatChat();
    });
    
    // ================== COURSES ==================
    const COURSES = [
      {
        topic: "Механика",
        items: [
          { id: "mech-1", title: "Физика (YouTube)", level: "8-сынып", url: "https://www.youtube.com/results?search_query=Ньютон" },
          { id: "mech-2", title: "Кинематика негіздері (YouTube)", level: "8-сынып", url: "https://www.youtube.com/results?search_query=Кинематика+8+сынып+физика" }
        ]
      },
      {
        topic: "Электр",
        items: [
          { id: "el-1", title: "Электр тогы: жұмыс және қуат", level: "8-сынып", url: "https://youtu.be/5XTauNV7fWY?si=u6v1PQg9p0cm-No-" },
          { id: "el-2", title: "Ом заңы (YouTube)", level: "8-сынып", url: "https://www.youtube.com/results?search_query=Ом+заңы+8+сынып+физика" }
        ]
      },
      {
        topic: "Оптика",
        items: [
          { id: "op-1", title: "Жарық сынуы (YouTube)", level: "8-сынып", url: "https://www.youtube.com/results?search_query=Жарық+сынуы+8+сынып+физика" },
          { id: "op-2", title: "Линзалар (YouTube)", level: "8-сынып", url: "https://www.youtube.com/results?search_query=Линза+8+сынып+физика" }
        ]
      }
    ];
    
    // Premium courses - only shown when purchased
    const PREMIUM_COURSES = {
      "premium-opt": {
        id: "premium-opt-course",
        title: "Оптика (Премиум курс)",
        level: "8-9 сынып",
        topicId: "optics",
        icon: "🔬"
      },
      "premium-thermo": {
        id: "premium-thermo-course",
        title: "Термодинамика (Премиум курс)",
        level: "9-10 сынып",
        topicId: "thermodynamics",
        icon: "🌡️"
      },
      "premium-mech": {
        id: "premium-mech-course",
        title: "Механика (Премиум курс)",
        level: "9-10 сынып",
        topicId: "mechanics",
        icon: "⚙️"
      },
      "premium-quantum": {
        id: "premium-quantum-course",
        title: "Квант физикасы (Премиум курс)",
        level: "11 сынып",
        topicId: "quantum",
        icon: "⚛️"
      }
    };
    
    function loadProgress() {
      try { return JSON.parse(localStorage.getItem('physx_course_progress') || "{}"); }
      catch { return {}; }
    }
    function saveProgress(obj) {
      try { localStorage.setItem('physx_course_progress', JSON.stringify(obj || {})); } catch(e) {}
    }
    function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
    function incCourseProgress(courseId, delta = 10) {
      const p = loadProgress();
      const next = clamp((p[courseId] ?? 0) + delta, 0, 100);
      p[courseId] = next;
      saveProgress(p);
      renderCourses(document.getElementById("courseSearch")?.value || "");
      renderProfileCourses();
    }
    function openCourse(url, courseId) {
      incCourseProgress(courseId, 5);
      addCoins(10, "Курс көрдіңіз");
      window.open(url, "_blank");
    }
    
    function openPremiumCourse(topicId, courseId) {
      openTopic(topicId);
      incCourseProgress(courseId, 5);
      addCoins(15, "Премиум курс көрдіңіз");
    }
    function renderCourses(filterText = "") {
      const root = document.getElementById("coursesRoot");
      if (!root) return;
      const q = (filterText || "").toLowerCase().trim();
      const progress = loadProgress();
      const purchases = getPurchases();
      root.innerHTML = "";
      
      // Check if user has any premium courses
      const hasPremiumCourses = Object.keys(PREMIUM_COURSES).some(key => purchases.includes(key));
      
      // Render Premium Courses first if user has any
      if (hasPremiumCourses) {
        const premiumItems = [];
        Object.entries(PREMIUM_COURSES).forEach(([purchaseId, course]) => {
          if (purchases.includes(purchaseId)) {
            const match = !q || (course.title + " " + course.level).toLowerCase().includes(q);
            if (match) {
              premiumItems.push({ ...course, purchaseId });
            }
          }
        });
        
        if (premiumItems.length > 0) {
          const wrap = document.createElement("div");
          wrap.className = "course-accordion";
          wrap.innerHTML = `
            <div class="acc-head" style="background: linear-gradient(135deg, rgba(157, 0, 255, 0.1) 0%, var(--surface) 100%); border-bottom: 1px solid rgba(157, 0, 255, 0.3);">
              <div class="left">
                <div class="h3" style="font-size:14px; color: var(--purple);">⭐ Премиум Курстар</div>
                <div class="txt-sm">${premiumItems.length} эксклюзивті курс</div>
              </div>
              <div class="right">
                <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </div>
            </div>
            <div class="acc-body"></div>
          `;
          const body = wrap.querySelector(".acc-body");
          
          premiumItems.forEach(item => {
            const val = progress[item.id] ?? 0;
            const node = document.createElement("div");
            node.className = "course-item";
            node.innerHTML = `
              <div class="course-row">
                <div style="min-width:0;">
                  <div class="course-title" style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 18px;">${item.icon}</span>
                    ${item.title}
                  </div>
                  <div class="course-meta">${item.level} • Прогресс: <b style="color:var(--purple)">${val}%</b></div>
                </div>
                <div class="course-actions">
                  <button class="course-btn" style="background: rgba(157, 0, 255, 0.1); border-color: var(--purple); color: var(--purple);" onclick="incCourseProgress('${item.id}', 10); showToast('+10% прогресс', '✓')">+10%</button>
                  <button class="course-btn primary" style="background: var(--purple);" onclick="openPremiumCourse('${item.topicId}', '${item.id}')">Оқу</button>
                </div>
              </div>
              <div class="mini-track"><div class="mini-fill" style="background: var(--purple); width:${val}%"></div></div>
            `;
            body.appendChild(node);
          });
          
          const head = wrap.querySelector(".acc-head");
          head.addEventListener("click", () => wrap.classList.toggle("open"));
          wrap.classList.add("open"); // Open by default
          root.appendChild(wrap);
        }
      }
      
      // Render regular courses
      COURSES.forEach(group => {
        const anyMatch = group.items.some(it =>
          (it.title + " " + it.level + " " + group.topic).toLowerCase().includes(q)
        );
        if (q && !anyMatch) return;
        const wrap = document.createElement("div");
        wrap.className = "course-accordion";
        wrap.innerHTML = `
          <div class="acc-head">
            <div class="left">
              <div class="h3" style="font-size:14px;">${group.topic}</div>
              <div class="txt-sm">${group.items.length} курс</div>
            </div>
            <div class="right">
              <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </div>
          </div>
          <div class="acc-body"></div>
        `;
        const body = wrap.querySelector(".acc-body");
        group.items.forEach(item => {
          const match = (item.title + " " + item.level + " " + group.topic).toLowerCase().includes(q);
          if (q && !match) return;
          const val = progress[item.id] ?? 0;
          const node = document.createElement("div");
          node.className = "course-item";
          node.innerHTML = `
            <div class="course-row">
              <div style="min-width:0;">
                <div class="course-title">${item.title}</div>
                <div class="course-meta">${item.level} • Прогресс: <b style="color:var(--primary)">${val}%</b></div>
              </div>
              <div class="course-actions">
                <button class="course-btn" onclick="incCourseProgress('${item.id}', 10); showToast('+10% прогресс', '✓')">+10%</button>
                <button class="course-btn primary" onclick="openCourse('${item.url}', '${item.id}')">Көру</button>
              </div>
            </div>
            <div class="mini-track"><div class="mini-fill" style="width:${val}%"></div></div>
          `;
          body.appendChild(node);
        });
        const head = wrap.querySelector(".acc-head");
        head.addEventListener("click", () => wrap.classList.toggle("open"));
        if (!q && group.topic === "Механика" && !hasPremiumCourses) wrap.classList.add("open");
        root.appendChild(wrap);
      });
    }
    function renderProfileCourses() {
      const node = document.getElementById("profileCourses");
      if (!node) return;
      const progress = loadProgress();
      const purchases = getPurchases();
      
      // Combine regular and premium courses
      let allCourses = COURSES.flatMap(g => g.items.map(it => ({ ...it, topic: g.topic, isPremium: false })));
      
      // Add purchased premium courses
      Object.entries(PREMIUM_COURSES).forEach(([purchaseId, course]) => {
        if (purchases.includes(purchaseId)) {
          allCourses.push({
            id: course.id,
            title: course.title,
            level: course.level,
            topic: "⭐ Премиум",
            isPremium: true,
            topicId: course.topicId
          });
        }
      });
      
      allCourses.sort((a, b) => (progress[b.id] ?? 0) - (progress[a.id] ?? 0));
      
      node.innerHTML = allCourses.slice(0, 6).map(it => {
        const val = progress[it.id] ?? 0;
        const colorClass = it.isPremium ? 'var(--purple)' : 'var(--primary)';
        return `
          <div class="list-item" style="cursor:pointer; ${it.isPremium ? 'border-color: rgba(157, 0, 255, 0.3);' : ''}" onclick="setTab('courses'); showToast('Курстар ашылды', '📚');">
            <div style="min-width:0;">
              <div class="h3" style="font-size:14px; margin-bottom:2px;">${it.title}</div>
              <div class="txt-sm">${it.topic} • ${it.level}</div>
              <div class="mini-track" style="margin-top:10px;"><div class="mini-fill" style="background: ${colorClass}; width:${val}%"></div></div>
            </div>
            <div class="deadline" style="color: ${colorClass}">${val}%</div>
          </div>
        `;
      }).join("");
    }
    
    // ================== INIT ==================
    (function initPhysX() {
      try {
        const saved = localStorage.getItem('physx_active_tab');
        if (saved && document.getElementById('tab-' + saved)) setTab(saved);
      } catch(e) {}
      
      updateCoinDisplay();
      renderCourses("");
      renderProfileCourses();
      renderNotifications();
      renderShop();
      updateHomeTopics(); // Update home page topics based on purchases
      
      const search = document.getElementById("courseSearch");
      if (search) {
        search.addEventListener("input", (e) => renderCourses(e.target.value));
      }
      
      // Add event listeners for confirm modal buttons
      const confirmCancelBtn = document.querySelector('.confirm-btn.cancel');
      const confirmConfirmBtn = document.querySelector('.confirm-btn.confirm');
      
      if (confirmCancelBtn) {
        confirmCancelBtn.addEventListener('click', closeConfirm);
        console.log('Cancel button listener added');
      }
      
      if (confirmConfirmBtn) {
        confirmConfirmBtn.addEventListener('click', () => {
          console.log('Confirm button clicked');
          confirmPurchase();
        });
        console.log('Confirm button listener added');
      }
      
      if (!localStorage.getItem('physx_welcomed')) {
        setTimeout(() => {
          addNotification("achievement", "Қош келдіңіз! 🎉", "physX платформасына бастапқы 50 джоуль берілді", "Жаңа");
          showAchievement("Қош келдіңіз! 🎊", "physX платформасына қош келдіңіз!");
          localStorage.setItem('physx_welcomed', 'true');
        }, 1000);
      }
      
      // Unlock purchased topics
      getPurchases().forEach(purchaseId => {
        const item = SHOP_ITEMS.find(i => i.id === purchaseId);
        if (item && item.unlocks) {
          unlockTopic(item.unlocks);
        }
      });
      
      console.log('physX initialized');
    })();