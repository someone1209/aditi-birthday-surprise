(() => {
      const gateScreen = document.getElementById('gate-screen');
      const birthdaySite = document.getElementById('birthday-site');
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
        'May life surprise you with beautiful little moments when you least expect them.',
        'May your favorite song always find you at exactly the right time.',
        'May you have brave little beginnings and gentle places to land.',
        'May there always be someone who listens when you have a story to tell.',
        'May your camera roll fill up with days you want to remember.',
        'May the things you work hard for feel worth the wait.',
        'May you find magic in ordinary afternoons and cozy evenings.',
        'May your heart feel safe, understood, and free to be exactly itself.',
        'May you get extra dessert, extra sleep, and extra reasons to grin.',
        'May your next adventure bring a view that makes you stop and stare.',
        'May you keep discovering little things that make you unmistakably you.',
        'May good news find its way to your doorstep more often this year.',
        'May you be as kind to yourself as you are to the people around you.',
        'May your favorite people show up with warmth, laughter, and snacks.',
        'May every new page of your story hold something lovely.',
        'May you always remember how much light you bring into the room.',
        'May the year ahead surprise you in all the sweetest ways.',
        'May you feel celebrated today, and cared for on all the ordinary days too.',
        'And one last wish: may your smile stay close, wherever this year takes you. ♡'
      ];
      let wishIndex = 0;
      document.getElementById('next-wish').addEventListener('click', () => {
        wishIndex = (wishIndex + 1) % wishes.length;
        const message = document.getElementById('wish-message');
        message.classList.remove('wish-changing');
        message.textContent = wishes[wishIndex];
        document.getElementById('wish-number').textContent = `A LITTLE WISH · ${String(wishIndex + 1).padStart(2, '0')} / ${String(wishes.length).padStart(2, '0')}`;
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

      // A tiny garden of birthday wishes: every flower reveals a different note.
      const flowerCards = [...document.querySelectorAll('.flower-card')];
      const bloomCount = document.getElementById('bloom-count');
      const bloomProgress = document.getElementById('bloom-progress');
      const gardenProgress = document.querySelector('.garden-progress[role="progressbar"]');
      const gardenMessage = document.getElementById('garden-message');
      let bloomsOpened = 0;
      flowerCards.forEach((flower) => {
        flower.setAttribute('aria-pressed', 'false');
        flower.addEventListener('click', () => {
          if (flower.getAttribute('aria-pressed') === 'true') return;
          flower.setAttribute('aria-pressed', 'true');
          flower.classList.add('is-bloomed');
          const note = flower.querySelector('.flower-note');
          if (note) note.textContent = flower.dataset.note || 'A little birthday wish, just for you. ♡';
          bloomsOpened += 1;
          bloomCount.textContent = String(bloomsOpened);
          bloomProgress.style.width = `${(bloomsOpened / flowerCards.length) * 100}%`;
          gardenProgress.setAttribute('aria-valuenow', String(bloomsOpened));
          gardenMessage.textContent = bloomsOpened === flowerCards.length
            ? 'Every flower is awake—and every little wish is yours to keep. You make this garden glow, Aditi. ♡'
            : `${bloomsOpened} little ${bloomsOpened === 1 ? 'wish' : 'wishes'} found… ${flowerCards.length - bloomsOpened} more ${flowerCards.length - bloomsOpened === 1 ? 'flower' : 'flowers'} are waiting for you. ✿`;
        });
      });

      // Twelve page-specific clues turn the scrapbook into a gentle treasure trail.
      const trailClues = [
        { question: 'Who is this birthday world made for?', choices: ['Aditi Soni', 'A sleepy kitten', 'A mystery princess'], answer: 0 },
        { question: 'What do you pull back to send your birthday wish flying?', choices: ['A ribbon', 'The arrow', 'A flower'], answer: 1 },
        { question: 'What is waiting in the middle of the hero scene?', choices: ['A birthday balloon', 'A tiny boat', 'A teacup'], answer: 0 },
        { question: 'Which little section lets you pick a birthday wish?', choices: ['The pocketful of wishes', 'The moon map', 'The cookie jar'], answer: 0 },
        { question: 'How many sleepy blossoms are waiting in the birthday garden?', choices: ['Six', 'Twelve', 'Sixteen'], answer: 2 },
        { question: 'What sight makes your spidy’s whole day?', choices: ['A rainy window', 'Your smiling face', 'A plate of noodles'], answer: 1 },
        { question: 'What can you tap to open a bigger view of a memory?', choices: ['A photo', 'The footer', 'A cloud'], answer: 0 },
        { question: 'How many little photo windows are on the memory wall?', choices: ['Four', 'Eight', 'Sixteen'], answer: 1 },
        { question: 'What can the memory movie do?', choices: ['Show the photos one by one', 'Make a birthday cake', 'Send a paper plane'], answer: 0 },
        { question: 'Which part has tiny letters for different kinds of days?', choices: ['Open when…', 'The balloon string', 'The top bar'], answer: 0 },
        { question: 'What name is signed at the end of the letter?', choices: ['yours spidy', 'the garden fairy', 'your secret cat'], answer: 0 },
        { question: 'What is waiting at the end of the heart-clue trail?', choices: ['A little birthday wish and a hug', 'A math test', 'A very serious meeting'], answer: 0 }
      ];
      const trailCounter = document.getElementById('trail-counter');
      const trailQuestion = document.getElementById('trail-question');
      const trailAnswers = document.getElementById('trail-answers');
      const trailFeedback = document.getElementById('trail-feedback');
      const trailNext = document.getElementById('trail-next');
      const trailProgress = document.querySelector('.trail-progress[role="progressbar"]');
      const trailProgressFill = document.getElementById('trail-progress-fill');
      const trailStamps = [...document.querySelectorAll('#trail-stamps span')];
      const trailFinale = document.getElementById('trail-finale');
      let activeClue = 0;
      let answeredClues = 0;
      let clueAnswered = false;

      function renderTrailClue() {
        const clue = trailClues[activeClue];
        clueAnswered = false;
        trailCounter.textContent = `CLUE ${String(activeClue + 1).padStart(2, '0')} / ${String(trailClues.length).padStart(2, '0')}`;
        trailQuestion.textContent = clue.question;
        trailFeedback.textContent = '';
        trailAnswers.replaceChildren();
        trailNext.hidden = true;
        clue.choices.forEach((choice, choiceIndex) => {
          const answerButton = document.createElement('button');
          answerButton.type = 'button';
          answerButton.className = 'trail-answer';
          answerButton.textContent = choice;
          answerButton.addEventListener('click', () => {
            if (clueAnswered) return;
            if (choiceIndex !== clue.answer) {
              trailFeedback.textContent = 'Hehe, not that one… have another little guess ♡';
              trailFeedback.classList.remove('is-correct');
              trailFeedback.classList.remove('is-wrong');
              void trailFeedback.offsetWidth;
              trailFeedback.classList.add('is-wrong');
              answerButton.classList.add('is-wrong');
              answerButton.disabled = true;
              return;
            }
            clueAnswered = true;
            answeredClues += 1;
            trailFeedback.textContent = ['That’s it, clever girl! ✦', 'Yesss, you found it! ♡', 'One more little stamp for you! ✿'][activeClue % 3];
            trailFeedback.classList.remove('is-wrong');
            trailFeedback.classList.add('is-correct');
            answerButton.classList.add('is-correct');
            trailAnswers.querySelectorAll('button').forEach((button) => { button.disabled = true; });
            if (trailStamps[activeClue]) {
              trailStamps[activeClue].textContent = ['✦', '🌷', '♡', '✿'][activeClue % 4];
              trailStamps[activeClue].classList.add('is-collected');
              trailStamps[activeClue].setAttribute('aria-label', `Clue ${activeClue + 1} collected`);
            }
            trailProgress.setAttribute('aria-valuenow', String(answeredClues));
            trailProgressFill.style.width = `${(answeredClues / trailClues.length) * 100}%`;
            trailNext.hidden = false;
            trailNext.innerHTML = activeClue === trailClues.length - 1
              ? 'open your little prize <span aria-hidden="true">♡</span>'
              : 'next little clue <span aria-hidden="true">↗</span>';
          });
          trailAnswers.append(answerButton);
        });
      }

      renderTrailClue();
      trailNext.addEventListener('click', () => {
        if (!clueAnswered) return;
        if (activeClue === trailClues.length - 1) {
          trailQuestion.hidden = true;
          trailAnswers.hidden = true;
          trailFeedback.hidden = true;
          trailCounter.textContent = 'A LITTLE TREASURE, JUST FOR YOU';
          trailNext.hidden = true;
          trailFinale.hidden = false;
          document.getElementById('trail-card').classList.add('trail-complete');
          return;
        }
        activeClue += 1;
        renderTrailClue();
      });

      // Open-when notes expand like small paper letters.
      document.querySelectorAll('.tiny-envelope-button').forEach((button) => {
        button.addEventListener('click', () => {
          const envelope = button.closest('.tiny-envelope');
          const note = button.nextElementSibling;
          const isOpening = button.getAttribute('aria-expanded') !== 'true';
          button.setAttribute('aria-expanded', String(isOpening));
          envelope.classList.toggle('is-open', isOpening);
          note.hidden = !isOpening;
          const symbol = button.querySelector('span');
          if (symbol) symbol.textContent = isOpening ? '－' : '＋';
        });
      });
    })();
