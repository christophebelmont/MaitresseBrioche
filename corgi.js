/* Émotions du corgi — partagé par tous les jeux.
   Usage :
     var c = Corgi.create(document.getElementById("corgiImg"));
     c.happy();  // très joyeux (réussite)
     c.sad();    // triste (erreur)
     c.cry();    // pleurs
     c.idle();   // retour au repos (alterne normal <-> interrogatif)
*/
(function () {
  "use strict";

  var IMG = {
    normal: "Content.png",
    interrogative: "Interrogatif.png",
    happy: "TresContent.png",
    sad: "Triste.png",
    cry: "Pleurs.png"
  };

  // précharge les images pour éviter le clignotement
  Object.keys(IMG).forEach(function (k) {
    var im = new Image();
    im.src = IMG[k];
  });

  var IDLE_MS = 3200;   // durée entre normal et interrogatif
  var HAPPY_MS = 2600;  // durée du "très joyeux"
  var SAD_MS = 1900;    // durée du "triste"

  function create(img) {
    var current = "normal";
    var idleTimer = null;
    var revertTimer = null;
    var locked = false;   // empêche l'idle de changer pendant une émotion

    function set(name) {
      if (!img || !IMG[name] || current === name) return;
      current = name;
      img.src = IMG[name];
    }

    function stopIdle() {
      if (idleTimer) { clearInterval(idleTimer); idleTimer = null; }
    }

    function startIdle() {
      stopIdle();
      locked = false;
      set("normal");
      idleTimer = setInterval(function () {
        if (locked) return;
        set(current === "interrogative" ? "normal" : "interrogative");
      }, IDLE_MS);
    }

    function flash(name, ms) {
      stopIdle();
      locked = true;
      set(name);
      if (revertTimer) clearTimeout(revertTimer);
      revertTimer = setTimeout(function () {
        locked = false;
        startIdle();
      }, ms);
    }

    startIdle();

    return {
      happy: function () { flash("happy", HAPPY_MS); },
      sad: function () { flash("sad", SAD_MS); },
      cry: function () { flash("cry", HAPPY_MS); },
      set: set,
      idle: startIdle,
      element: img
    };
  }

  window.Corgi = { create: create, IMG: IMG };
})();
