(() => {
      const gateScreen = document.getElementById('gate-screen');
      const birthdaySite = document.getElementById('birthday-site');
      const openingLock = document.getElementById('opening-lock');
      const lockStatus = document.getElementById('lock-status');
      const unlockDate = new Date(0);
      const countdownNodes = {
        days: document.getElementById('count-days'),
        hours: document.getElementById('count-hours'),
        minutes: document.getElementById('count-minutes'),
        seconds: document.getElementById('count-seconds')
      };
      let countdownTimer = 0;

      function updateOpeningLock() {
        const secondsLeft = Math.max(0, Math.ceil((unlockDate.getTime() - Date.now()) / 1000));
        if (secondsLeft === 0) {
          window.clearInterval(countdownTimer);
          openingLock.hidden = true;
          gateScreen.hidden = false;
          gateScreen.setAttribute('aria-hidden', 'false');
          gateScreen.classList.add('gate-unlocked');
          lockStatus.textContent = 'It’s time… your little birthday story is ready ♡';
          return false;
        }

        const values = {
          days: Math.floor(secondsLeft / 86400),
          hours: Math.floor((secondsLeft % 86400) / 3600),
          minutes: Math.floor((secondsLeft % 3600) / 60),
          seconds: secondsLeft % 60
        };
        Object.entries(values).forEach(([unit, value]) => {
          const nextValue = String(value).padStart(2, '0');
          const node = countdownNodes[unit];
          if (node.textContent !== nextValue) {
            node.textContent = nextValue;
            node.classList.remove('count-tick');
            void node.offsetWidth;
            node.classList.add('count-tick');
          }
        });
        return true;
      }

      if (updateOpeningLock()) countdownTimer = window.setInterval(updateOpeningLock, 1000);

      const gateTitle = document.getElementById('gate-title');
      const gateCopy = document.getElementById('gate-copy');
      const gateMascot = document.getElementById('gate-mascot');
      const humanChoices = document.getElementById('human-choices');
      const secretChoices = document.getElementById('secret-choices');
      const openBirthday = document.getElementById('open-birthday');
      const gateCard = document.querySelector('.gate-card');
      const animals = [
        { name: 'monkeyy', face: '🐒' }, { name: 'penguinn', face: '🐧' },
        { name: 'bunnyy', face: '🐰' }, { name: 'kittenn', face: '🐱' },
        { name: 'ducklingg', face: '🐥' }, { name: 'pandaguu', face: '🐼' },
        { name: 'koalaa', face: '🐨' }, { name: 'beaverroo', face: '🦫' },
        { name: 'puppyyy', face: '🐶' }, { name: 'foxyy', face: '🦊' }
      ];
      let previousAnimal = -1;

      function sayGateLine(text, face) {
        gateCopy.classList.remove('reply-pop');
        gateCopy.textContent = text;
        void gateCopy.offsetWidth;
        gateCopy.classList.add('reply-pop');
        if (face) {
          gateMascot.classList.remove('is-changing');
          gateMascot.textContent = face;
          void gateMascot.offsetWidth;
          gateMascot.classList.add('is-changing');
        }
      }

      function changeGatePage(update) {
        gateCard.classList.add('page-swapping');
        window.setTimeout(() => {
          update();
          gateCard.classList.remove('page-swapping');
        }, 150);
      }

      document.getElementById('human-yes').addEventListener('click', () => {
        let animalIndex;
        do { animalIndex = Math.floor(Math.random() * animals.length); } while (animalIndex === previousAnimal);
        previousAnimal = animalIndex;
        const animal = animals[animalIndex];
        sayGateLine(`nopeee u are ${animal.name}!! tap yesss again for a different animal hehehee 🙈`, animal.face);
      });

      document.getElementById('human-no').addEventListener('click', () => {
        gateTitle.textContent = 'Hehehee, I knew it!';
        sayGateLine('merkoo to ptaa tha phelee see hehehee, babyyyy vo naa aapse kuch khenaa thaaa bolu? 😼', '😼');
        humanChoices.hidden = true;
        secretChoices.hidden = false;
      });

      document.getElementById('secret-yes').addEventListener('click', () => {
        sayGateLine('nhi bol rhaaa 💔', '🥺');
      });

      document.getElementById('secret-no').addEventListener('click', () => {
        secretChoices.querySelectorAll('button').forEach((button) => { button.disabled = true; });
        changeGatePage(() => {
          gateTitle.textContent = 'Achaaa, sunooo!';
          sayGateLine('mai to bolungaa 😌', '💌');
          secretChoices.hidden = true;
          openBirthday.hidden = false;
        });
      });

      openBirthday.addEventListener('click', () => {
        birthdaySite.hidden = false;
        birthdaySite.setAttribute('aria-hidden', 'false');
        birthdaySite.classList.add('site-entering');
        gateScreen.classList.add('gate-leaving');
        window.scrollTo(0, 0);
        const exitDelay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 20 : 480;
        window.setTimeout(() => {
          gateScreen.hidden = true;
          gateScreen.setAttribute('aria-hidden', 'true');
          birthdaySite.classList.remove('site-entering');
          layoutArrow();
        }, exitDelay);
      });

      const stage = document.getElementById('celebration-stage');
      const arrow = document.getElementById('arrow');
      const bowWrap = document.querySelector('.bow-wrap');
      const bowString = document.getElementById('bow-string');
      const shotHint = document.getElementById('shot-hint');
      const particles = document.getElementById('particle-layer');
      let busy = false;
      let popped = false;
      let aimGeometry = null;
      let dragSession = null;
      const loveNotes = [
        'happy birthday, Aditi ♡', 'my favorite girl', 'all my love, always',
        'your smile makes my day', 'Aditi Soni, you are so loved', 'forever feels like you'
      ];
      const colors = ['#e995a7', '#dba468', '#fff4dd', '#ad6e85', '#f0c8ba', '#be8791'];

      function setBurstPosition() {
        const rect = stage.getBoundingClientRect();
        const left = rect.width * (window.innerWidth <= 600 ? .63 : .62);
        const top = rect.height * (window.innerWidth <= 600 ? .34 : .35);
        return { left, top };
      }

      function makeParticles() {
        particles.replaceChildren();
        const center = setBurstPosition();
        for (let i = 0; i < 52; i++) {
          const piece = document.createElement('i');
          piece.className = 'confetti';
          piece.style.setProperty('--x', `${center.left + (Math.random() - .5) * 70}px`);
          piece.style.setProperty('--y', `${center.top + (Math.random() - .5) * 40}px`);
          piece.style.setProperty('--dx', `${(Math.random() - .5) * 570}px`);
          piece.style.setProperty('--dy', `${260 + Math.random() * 650}px`);
          piece.style.setProperty('--spin', `${(Math.random() - .5) * 1200}deg`);
          piece.style.setProperty('--duration', `${2.4 + Math.random() * 2.5}s`);
          piece.style.setProperty('--delay', `${Math.random() * .35}s`);
          piece.style.setProperty('--w', `${5 + Math.random() * 7}px`);
          piece.style.setProperty('--h', `${7 + Math.random() * 12}px`);
          piece.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
          particles.append(piece);
        }
        loveNotes.forEach((note, index) => {
          const card = document.createElement('span');
          card.className = 'falling-note';
          card.textContent = note;
          card.style.setProperty('--x', `${center.left + (Math.random() - .5) * 150}px`);
          card.style.setProperty('--y', `${center.top + (Math.random() - .5) * 55}px`);
          card.style.setProperty('--dx', `${(Math.random() - .5) * 360}px`);
          card.style.setProperty('--dy', `${350 + Math.random() * 500}px`);
          card.style.setProperty('--spin', `${(Math.random() - .5) * 70}deg`);
          card.style.setProperty('--duration', `${3.2 + Math.random() * 2.2}s`);
          card.style.setProperty('--delay', `${.04 * index}s`);
          particles.append(card);
        });
        for (let i = 0; i < 9; i++) {
          const ribbon = document.createElement('i');
          ribbon.className = 'ribbon-piece';
          ribbon.style.setProperty('--x', `${center.left + (Math.random() - .5) * 100}px`);
          ribbon.style.setProperty('--y', `${center.top}px`);
          ribbon.style.setProperty('--dx', `${(Math.random() - .5) * 480}px`);
          ribbon.style.setProperty('--dy', `${350 + Math.random() * 600}px`);
          ribbon.style.setProperty('--spin', `${(Math.random() - .5) * 740}deg`);
          ribbon.style.setProperty('--duration', `${3 + Math.random() * 2.3}s`);
          ribbon.style.setProperty('--delay', `${Math.random() * .3}s`);
          ribbon.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
          particles.append(ribbon);
        }
        const sparkles = ['♡', '♥', '✦', '✧', '♡', '✿'];
        for (let i = 0; i < 18; i++) {
          const heart = document.createElement('span');
          heart.className = 'heart-spark';
          heart.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
          heart.style.setProperty('--x', `${center.left + (Math.random() - .5) * 90}px`);
          heart.style.setProperty('--y', `${center.top + (Math.random() - .5) * 45}px`);
          heart.style.setProperty('--dx', `${(Math.random() - .5) * 470}px`);
          heart.style.setProperty('--dy', `${-100 + (Math.random() - .5) * 430}px`);
          heart.style.setProperty('--spin', `${(Math.random() - .5) * 150}deg`);
          heart.style.setProperty('--duration', `${1.7 + Math.random() * 1.2}s`);
          heart.style.setProperty('--delay', `${Math.random() * .25}s`);
          heart.style.setProperty('--size', `${13 + Math.random() * 17}px`);
          heart.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
          particles.append(heart);
        }
      }

      function layoutArrow() {
        const stageRect = stage.getBoundingClientRect();
        const bowRect = bowWrap.getBoundingClientRect();
        const targetRect = document.getElementById('main-balloon').getBoundingClientRect();
        if (!stageRect.width || !stageRect.height || !bowRect.width || !targetRect.width) return null;
        const bowMatrix = bowString.ownerSVGElement.getScreenCTM();
        if (!bowMatrix) return null;
        const anchorScreen = new DOMPoint(132, 160).matrixTransform(bowMatrix);
        const anchorX = anchorScreen.x - stageRect.left;
        const anchorY = anchorScreen.y - stageRect.top;
        const targetX = targetRect.left - stageRect.left + targetRect.width / 2;
        const targetY = targetRect.top - stageRect.top + targetRect.height / 2;
        const dx = targetX - anchorX;
        const dy = targetY - anchorY;
        const distance = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        const pivot = 11 / 240;
        const tip = 232 / 240;
        const width = distance / (tip - pivot);

        aimGeometry = { anchorX, anchorY, anchorScreenX: anchorScreen.x, anchorScreenY: anchorScreen.y, stringMatrix: bowMatrix, distance, angle, cos: Math.cos(angle), sin: Math.sin(angle), pivot, width };
        arrow.style.width = `${width}px`;
        arrow.style.setProperty('--shot-angle', `${angle}rad`);
        positionArrow(0);
        setBowDraw(0);
        return aimGeometry;
      }

      function positionArrow(drawAmount) {
        if (!aimGeometry) return;
        const originX = aimGeometry.anchorX - drawAmount * aimGeometry.cos;
        const originY = aimGeometry.anchorY - drawAmount * aimGeometry.sin;
        arrow.style.left = `${originX - aimGeometry.width * aimGeometry.pivot}px`;
        arrow.style.top = `${originY - arrow.offsetHeight / 2}px`;
        arrow.style.transform = `rotate(${aimGeometry.angle}rad)`;
      }

      function setBowDraw(drawAmount) {
        if (!aimGeometry) return;
        const controlOnScreen = new DOMPoint(
          aimGeometry.anchorScreenX - 2 * drawAmount * aimGeometry.cos,
          aimGeometry.anchorScreenY - 2 * drawAmount * aimGeometry.sin
        );
        const control = controlOnScreen.matrixTransform(aimGeometry.stringMatrix.inverse());
        bowString.setAttribute('d', `M132 10 Q${control.x} ${control.y} 132 310`);
      }

      function rearmBalloon() {
        stage.classList.remove('popped', 'shooting', 'drawing');
        particles.replaceChildren();
        popped = false;
        busy = false;
        layoutArrow();
        shotHint.textContent = 'Drag the arrow back again for another birthday wish ✦';
      }

      function popBalloon() {
        if (popped) return;
        popped = true;
        stage.classList.remove('shooting', 'drawing');
        layoutArrow();
        stage.classList.add('popped');
        makeParticles();
        setBowDraw(0);
        shotHint.textContent = 'One wish down! Drag the arrow again for another ✦';
        busy = false;
      }

      function shoot(drawAmount) {
        if (!aimGeometry) layoutArrow();
        if (!aimGeometry) return;
        busy = true;
        arrow.style.setProperty('--flight-x', `${drawAmount * aimGeometry.cos}px`);
        arrow.style.setProperty('--flight-y', `${drawAmount * aimGeometry.sin}px`);
        stage.classList.remove('popped', 'drawing', 'shooting');
        void stage.offsetWidth;
        setBowDraw(0);
        stage.classList.add('shooting');
        shotHint.textContent = 'whooosh… your wish is flying to you! ✨';
        window.setTimeout(popBalloon, 850);
      }

      arrow.addEventListener('pointerdown', (event) => {
        if (event.button !== undefined && event.button !== 0) return;
        if (busy) return;
        if (popped) rearmBalloon();
        if (!aimGeometry) layoutArrow();
        if (!aimGeometry) return;
        event.preventDefault();
        busy = true;
        dragSession = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, draw: 0 };
        arrow.classList.add('dragging');
        stage.classList.add('drawing');
        arrow.setPointerCapture(event.pointerId);
        shotHint.textContent = 'That’s it… pull back and let go!';
      });

      arrow.addEventListener('pointermove', (event) => {
        if (!dragSession || dragSession.pointerId !== event.pointerId) return;
        const dx = event.clientX - dragSession.startX;
        const dy = event.clientY - dragSession.startY;
        const pull = -(dx * aimGeometry.cos + dy * aimGeometry.sin);
        dragSession.draw = Math.max(0, Math.min(pull, 130, aimGeometry.distance * .46));
        positionArrow(dragSession.draw);
        setBowDraw(dragSession.draw);
      });

      arrow.addEventListener('pointerup', (event) => {
        if (!dragSession || dragSession.pointerId !== event.pointerId) return;
        const drawAmount = dragSession.draw;
        if (arrow.hasPointerCapture(event.pointerId)) arrow.releasePointerCapture(event.pointerId);
        dragSession = null;
        arrow.classList.remove('dragging');
        stage.classList.remove('drawing');
        if (drawAmount >= 24) {
          shoot(drawAmount);
        } else {
          busy = false;
          positionArrow(0);
          setBowDraw(0);
          shotHint.textContent = 'Pull the arrow back a little farther, babyyy ✦';
        }
      });

      arrow.addEventListener('pointercancel', () => {
        dragSession = null;
        arrow.classList.remove('dragging');
        stage.classList.remove('drawing');
        busy = false;
        positionArrow(0);
        setBowDraw(0);
      });

      arrow.addEventListener('keydown', (event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !event.repeat && !busy) {
          event.preventDefault();
          if (popped) rearmBalloon();
          if (!aimGeometry) layoutArrow();
          if (aimGeometry) shoot(Math.min(105, aimGeometry.distance * .38));
        }
      });

      window.addEventListener('resize', () => {
        if (!busy && !popped) layoutArrow();
      });
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.documentElement.classList.add('js-ready');
      const revealItems = document.querySelectorAll('.reveal');
      if (!reducedMotion && 'IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: .12, rootMargin: '0px 0px -36px 0px' });
        revealItems.forEach((item, index) => {
          item.style.setProperty('--reveal-delay', `${(index % 3) * 85}ms`);
          revealObserver.observe(item);
        });
      } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
      }
      document.querySelectorAll('.photo-card').forEach((card, index) => {
        card.style.setProperty('--reveal-delay', `${index * 105}ms`);
      });

      let lastTrail = 0;
      if (!reducedMotion) {
        document.addEventListener('pointermove', (event) => {
          if (event.pointerType !== 'mouse') return;
          const now = performance.now();
          if (now - lastTrail < 90) return;
          lastTrail = now;
          const heart = document.createElement('span');
          heart.className = 'heart-trail';
          heart.textContent = Math.random() > .72 ? '✦' : '♡';
          heart.style.left = `${event.clientX}px`;
          heart.style.top = `${event.clientY}px`;
          heart.style.setProperty('--trail-color', colors[Math.floor(Math.random() * colors.length)]);
          heart.style.setProperty('--trail-size', `${11 + Math.random() * 9}px`);
          heart.style.setProperty('--trail-dx', `${(Math.random() - .5) * 24}px`);
          document.body.append(heart);
          window.setTimeout(() => heart.remove(), 1000);
        }, { passive: true });

        stage.addEventListener('pointermove', (event) => {
          if (event.pointerType !== 'mouse') return;
          const rect = stage.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width - .5) * 10;
          const y = ((event.clientY - rect.top) / rect.height - .5) * 9;
          stage.style.setProperty('--drift-x', `${x}px`);
          stage.style.setProperty('--drift-y', `${y}px`);
        }, { passive: true });
        stage.addEventListener('pointerleave', () => {
          stage.style.setProperty('--drift-x', '0px');
          stage.style.setProperty('--drift-y', '0px');
        });
      }
      const photoCards = Array.from(document.querySelectorAll('.photo-card'));
      const photoLightbox = document.getElementById('photo-lightbox');
      const lightboxImage = document.getElementById('lightbox-image');
      const lightboxCaption = document.getElementById('lightbox-caption');
      const lightboxCounter = document.getElementById('lightbox-counter');
      const lightboxProgress = document.getElementById('lightbox-progress-bar');
      const lightboxThumbnails = document.getElementById('lightbox-thumbnails');
      const slideshowButton = document.getElementById('slideshow-toggle');
      const memoryFilmButton = document.getElementById('play-memories');
      let activePhotoIndex = 0;
      let lightboxCards = [];
      let lastPhotoTrigger = null;
      let closePhotoTimer = 0;
      let slideshowTimer = 0;
      let slideshowPlaying = false;
      let swipeStart = null;

      function makeMemorySparkles(card, clientX, clientY) {
        const rect = card.getBoundingClientRect();
        const symbols = ['♡', '✦', '✧', '♥'];
        for (let index = 0; index < 3; index++) {
          const sparkle = document.createElement('span');
          sparkle.className = 'memory-spark';
          sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
          sparkle.style.left = `${clientX - rect.left}px`;
          sparkle.style.top = `${clientY - rect.top}px`;
          sparkle.style.setProperty('--spark-dx', `${(Math.random() - .5) * 64}px`);
          sparkle.style.setProperty('--spark-dy', `${-28 - Math.random() * 35}px`);
          sparkle.style.setProperty('--spark-delay', `${index * 45}ms`);
          sparkle.style.setProperty('--spark-color', colors[Math.floor(Math.random() * colors.length)]);
          card.append(sparkle);
          window.setTimeout(() => sparkle.remove(), 1050);
        }
      }

      if (!reducedMotion) {
        photoCards.forEach((card) => {
          card.addEventListener('pointermove', (event) => {
            if (event.pointerType !== 'mouse') return;
            const rect = card.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - .5;
            const y = (event.clientY - rect.top) / rect.height - .5;
            card.style.setProperty('--photo-rx', `${(-y * 7).toFixed(2)}deg`);
            card.style.setProperty('--photo-ry', `${(x * 10).toFixed(2)}deg`);
          });
          card.addEventListener('pointerenter', (event) => {
            if (event.pointerType === 'mouse') makeMemorySparkles(card, event.clientX, event.clientY);
          });
          card.addEventListener('pointerleave', () => {
            card.style.setProperty('--photo-rx', '2deg');
            card.style.setProperty('--photo-ry', '0deg');
          });
        });
      }

      function activatePhoto(card, img) {
        card.classList.add('has-photo');
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        const caption = card.querySelector('figcaption')?.textContent.trim() || 'A favorite memory';
        card.setAttribute('aria-label', `Open photo: ${caption}`);
        img.alt = img.alt || caption;
      }

      document.querySelectorAll('.photo-card img').forEach((img) => {
        const card = img.closest('.photo-card');
        img.addEventListener('load', () => activatePhoto(card, img));
        img.addEventListener('error', () => img.removeAttribute('src'), { once: true });
        if (img.complete && img.naturalWidth > 0) activatePhoto(card, img);
      });

      photoCards.forEach((card, index) => {
        const label = document.createElement('span');
        label.className = 'photo-index';
        label.textContent = `memory ${String(index + 1).padStart(2, '0')}`;
        label.setAttribute('aria-hidden', 'true');
        card.prepend(label);
      });

      const wishes = [
        'May this year bring you the kind of laughter that makes your cheeks hurt.',
        'May every dream you whisper to yourself find its way a little closer.',
        'May you feel proud of the person you are becoming, Aditi.',
        'May your days hold soft mornings, kind people, and all your favorite treats.',
        'May the smile you give everyone find its way back to you a hundred times over.',
        'May life surprise you with beautiful little moments when you least expect them.'
      ];
      let wishIndex = 0;
      document.getElementById('next-wish').addEventListener('click', () => {
        wishIndex = (wishIndex + 1) % wishes.length;
        const message = document.getElementById('wish-message');
        message.classList.remove('wish-changing');
        message.textContent = wishes[wishIndex];
        document.getElementById('wish-number').textContent = `A LITTLE WISH · ${String(wishIndex + 1).padStart(2, '0')}`;
        void message.offsetWidth;
        message.classList.add('wish-changing');
      });

      const letterEnvelope = document.getElementById('letter-envelope');
      const openLetter = document.getElementById('open-letter');
      const letterNote = document.getElementById('letter-note');
      openLetter.addEventListener('click', () => {
        const isOpen = letterEnvelope.classList.toggle('is-open');
        openLetter.setAttribute('aria-expanded', String(isOpen));
        openLetter.innerHTML = isOpen
          ? 'Your letter is open, Aditi <span aria-hidden="true">♡</span>'
          : 'Open your letter, Aditi <span aria-hidden="true">💌</span>';
        letterNote.hidden = !isOpen;
        if (isOpen) {
          window.requestAnimationFrame(() => letterNote.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' }));
        }
      });

      function prepareMemoryMovie() {
        lightboxCards = photoCards.filter((card) => card.querySelector('img')?.getAttribute('src'));
      }

      function buildLightboxThumbnails() {
        lightboxThumbnails.replaceChildren();
        lightboxCards.forEach((card, index) => {
          const source = card.querySelector('img');
          const button = document.createElement('button');
          const thumb = document.createElement('img');
          button.type = 'button';
          button.className = 'lightbox-thumb';
          button.setAttribute('aria-label', `Show memory ${index + 1}`);
          button.setAttribute('aria-current', 'false');
          thumb.src = source.currentSrc || source.src;
          thumb.alt = '';
          thumb.loading = 'lazy';
          button.append(thumb);
          button.addEventListener('click', () => showLightboxPhoto(index, index >= activePhotoIndex ? 'next' : 'prev'));
          lightboxThumbnails.append(button);
        });
      }

      function showLightboxPhoto(index, direction) {
        if (!lightboxCards.length) prepareMemoryMovie();
        if (!lightboxCards.length) return;
        activePhotoIndex = (index + lightboxCards.length) % lightboxCards.length;
        const card = lightboxCards[activePhotoIndex];
        const source = card.querySelector('img');
        direction ||= activePhotoIndex >= (Number(lightboxImage.dataset.photoIndex) || 0) ? 'next' : 'prev';
        lightboxImage.classList.remove('photo-changing-next', 'photo-changing-prev');
        lightboxImage.src = source.currentSrc || source.src;
        lightboxImage.alt = source.alt;
        lightboxCaption.textContent = card.querySelector('figcaption')?.textContent.trim() || source.alt;
        lightboxCounter.textContent = `${String(activePhotoIndex + 1).padStart(2, '0')}  /  ${String(lightboxCards.length).padStart(2, '0')}`;
        lightboxProgress.style.width = `${((activePhotoIndex + 1) / lightboxCards.length) * 100}%`;
        lightboxImage.dataset.photoIndex = String(activePhotoIndex);
        lightboxThumbnails.querySelectorAll('.lightbox-thumb').forEach((button, thumbIndex) => {
          button.setAttribute('aria-current', String(thumbIndex === activePhotoIndex));
        });
        void lightboxImage.offsetWidth;
        lightboxImage.classList.add(direction === 'prev' ? 'photo-changing-prev' : 'photo-changing-next');
        lightboxCaption.classList.remove('caption-changing');
        void lightboxCaption.offsetWidth;
        lightboxCaption.classList.add('caption-changing');
      }

      photoCards.forEach((card) => {
        const openCard = () => {
          if (!card.classList.contains('has-photo')) return;
          prepareMemoryMovie();
          buildLightboxThumbnails();
          lastPhotoTrigger = card;
          showLightboxPhoto(lightboxCards.indexOf(card), 'next');
          if (!photoLightbox.open) photoLightbox.showModal();
        };
        card.addEventListener('click', openCard);
        card.addEventListener('keydown', (event) => {
          if (event.target !== card || !['Enter', ' '].includes(event.key)) return;
          event.preventDefault();
          openCard();
        });
      });

      function closePhotoLightbox() {
        if (!photoLightbox.open) return;
        stopMemoryMovie();
        window.clearTimeout(closePhotoTimer);
        photoLightbox.classList.add('is-closing');
        closePhotoTimer = window.setTimeout(() => {
          if (photoLightbox.open) photoLightbox.close();
          photoLightbox.classList.remove('is-closing');
          if (lastPhotoTrigger?.isConnected) lastPhotoTrigger.focus({ preventScroll: true });
        }, reducedMotion ? 20 : 240);
      }

      function startMemoryMovie() {
        if (!lightboxCards.length) prepareMemoryMovie();
        if (!lightboxCards.length) return;
        window.clearInterval(slideshowTimer);
        slideshowPlaying = true;
        slideshowButton.setAttribute('aria-pressed', 'true');
        slideshowButton.innerHTML = '<span aria-hidden="true">Ⅱ</span> pause';
        slideshowTimer = window.setInterval(() => showLightboxPhoto(activePhotoIndex + 1, 'next'), 3900);
      }

      function stopMemoryMovie() {
        window.clearInterval(slideshowTimer);
        slideshowTimer = 0;
        slideshowPlaying = false;
        slideshowButton.setAttribute('aria-pressed', 'false');
        slideshowButton.innerHTML = '<span aria-hidden="true">▶</span> play';
      }

      function openMemoryMovie() {
        prepareMemoryMovie();
        if (!lightboxCards.length) return;
        buildLightboxThumbnails();
        lastPhotoTrigger = memoryFilmButton;
        showLightboxPhoto(0, 'next');
        if (!photoLightbox.open) photoLightbox.showModal();
        startMemoryMovie();
      }

      document.getElementById('lightbox-close').addEventListener('click', closePhotoLightbox);
      document.getElementById('lightbox-prev').addEventListener('click', () => showLightboxPhoto(activePhotoIndex - 1, 'prev'));
      document.getElementById('lightbox-next').addEventListener('click', () => showLightboxPhoto(activePhotoIndex + 1, 'next'));
      slideshowButton.addEventListener('click', () => slideshowPlaying ? stopMemoryMovie() : startMemoryMovie());
      memoryFilmButton.addEventListener('click', openMemoryMovie);
      photoLightbox.addEventListener('cancel', (event) => {
        event.preventDefault();
        closePhotoLightbox();
      });
      photoLightbox.addEventListener('close', stopMemoryMovie);
      photoLightbox.addEventListener('click', (event) => {
        if (event.target === photoLightbox) closePhotoLightbox();
      });
      photoLightbox.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') showLightboxPhoto(activePhotoIndex - 1, 'prev');
        if (event.key === 'ArrowRight') showLightboxPhoto(activePhotoIndex + 1, 'next');
      });
      document.querySelector('.lightbox-viewer').addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'touch') swipeStart = { x: event.clientX, y: event.clientY };
      });
      document.querySelector('.lightbox-viewer').addEventListener('pointerup', (event) => {
        if (!swipeStart) return;
        const deltaX = event.clientX - swipeStart.x;
        const deltaY = event.clientY - swipeStart.y;
        swipeStart = null;
        if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
          showLightboxPhoto(activePhotoIndex + (deltaX < 0 ? 1 : -1), deltaX < 0 ? 'next' : 'prev');
        }
      });
      document.querySelector('.lightbox-viewer').addEventListener('pointercancel', () => { swipeStart = null; });
    })();
