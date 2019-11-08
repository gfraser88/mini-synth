var audio = document.createElement("audio");
var pianoKey = Array.from(document.getElementsByClassName("key"));
var container = document.getElementById("container");
var keyFlag = false;
var idArray = [];
var noteArray = [];
const synth = new Tone.PolySynth(4, Tone.FMSynth);

synth.toMaster();

//$("#volume").val(Math.exp(synth.volume.value / 20) * Math.log(10) * 100);

var gearAnim = anime({
  targets: "#btnSettings",
  rotate: "1turn",
  easing: "linear",
  duration: 1500,
  loop: true,
  autoplay: false
});

gearAnim2 = anime({
  targets: "#btnSettings",
  rotate: "1turn",
  //easing: "linear",
  duration: 500,
  autoplay: false
});

$("#btnSettings").on("click", function() {
  if ($("#settings").is(":hidden")) {
    $("#settings").slideDown("fast");
    gearAnim.pause();
    gearAnim2.play();
  } else {
    $("#settings").slideUp("fast");
    gearAnim.pause();
    gearAnim2.play();
  }
  //$(this).hide("slide", { direction: "right" }, "slow");
});

$("#btnSettings").hover(
  function() {
    gearAnim.play();
  },
  function() {
    gearAnim.pause();
  }
);

$("#btnHelp").on("click", function() {
  if($("#letters").attr("display") == "none") {
    $("#letters").removeAttr("display");
  }
  else {
    $("#letters").attr("display", "none");
  }
})

// $(".knob").knob({
//   height: 75,
//   width: 75,
//   fgColor: "#C0ffff",
//   bgColor: "#1e2328",
//   skin: "tron",
//   font: "Open Sans",
//   thickness: 0.1,
//   angleOffset: 180
// });

$("#volume").val(50);
synth.volume.value = -60 + (30 - -60) * (50 / 100);

$("#volume").knob({
  min: 0,
  max: 100,
  step: 1,
  width: 75,
  height: 75,
  fgColor: "#C0ffff",
  bgColor: "#1e2328",
  skin: "tron",
  font: "Open Sans, sans-serif",
  thickness: 0.1,
  angleOffset: 180,
  change: function(e) {
    synth.volume.value = -60 + (30 - -60) * (parseInt(e) / 100);
  }
});

$("#detune").val(synth.detune.value);
$("#detune").knob({
  min: -1200,
  max: 1200,
  step: 1,
  width: 75,
  height: 75,
  fgColor: "#C0ffff",
  bgColor: "#1e2328",
  skin: "tron",
  font: "Open Sans, sans-serif",
  thickness: 0.1,
  angleOffset: 180,
  change: function(e) {
    synth.detune.value = e;
  }
});

$("#envAttack").val(synth.get("envelope.attack")["envelope"]["attack"]);
$("#envAttack").knob({
  min: 0,
  max: 10,
  step: 0.1,
  width: 50,
  height: 50,
  fgColor: "#C0ffff",
  bgColor: "#1e2328",
  skin: "tron",
  font: "Open Sans, sans-serif",
  thickness: 0.1,
  angleOffset: 180,
  change: function(e) {
    synth.set({ envelope: { attack: parseInt(e) } });
  }
});

$("#envDecay").val(synth.get("envelope.decay")["envelope"]["decay"]);
$("#envDecay").knob({
  min: 0,
  max: 10,
  step: 0.1,
  width: 50,
  height: 50,
  fgColor: "#C0ffff",
  bgColor: "#1e2328",
  skin: "tron",
  font: "Open Sans, sans-serif",
  thickness: 0.1,
  angleOffset: 180,
  change: function(e) {
    synth.set({ envelope: { attack: parseInt(e) } });
  }
});

$("#envRelease").val(synth.get("envelope.release")["envelope"]["release"]);
$("#envRelease").knob({
  min: 0,
  max: 10,
  step: 0.1,
  width: 50,
  height: 50,
  fgColor: "#C0ffff",
  bgColor: "#1e2328",
  skin: "tron",
  font: "Open Sans, sans-serif",
  thickness: 0.1,
  angleOffset: 180,
  change: function(e) {
    synth.set({ envelope: { attack: parseInt(e) } });
  }
});

$("#envSustain").val(synth.get("envelope.sustain")["envelope"]["sustain"]);
$("#envSustain").knob({
  min: 0,
  max: 10,
  step: 0.1,
  width: 50,
  height: 50,
  fgColor: "#C0ffff",
  bgColor: "#1e2328",
  skin: "tron",
  font: "Open Sans, sans-serif",
  thickness: 0.1,
  angleOffset: 180,
  change: function(e) {
    synth.set({ envelope: { attack: parseInt(e) } });
  }
});

document.addEventListener(
  "keydown",
  function(e) {
    var code = e.charCode || e.keyCode;
    var control = document.querySelector('[data-key="' + code + '"]');
    if (control != null) {
      control.classList.add("keypress");
      var note = control.getAttribute("data-note");
      if (noteArray.includes(note) == false) {
        animateNote(note);
        synth.triggerAttack(note);
        // pianoPress(control, true);
        noteArray.push(note);
      }
    }
  },
  false
);

document.addEventListener(
  "keyup",
  function(e) {
    var code = e.charCode || e.keyCode;
    var control = document.querySelector('[data-key="' + code + '"]');
    if (control != null) {
      control.classList.remove("keypress");
      var note = control.getAttribute("data-note");
      keyFlag = false;
      synth.triggerRelease(note);
      for (var i = 0; i < noteArray.length; i++) {
        if (note == noteArray[i]) {
          noteArray.splice(i, 1);
        }
      }
      // pianoPress(control, false);
    }
  },
  false
);

pianoKey.forEach(function(x) {
  // var note = x.getAttribute("data-note");
  // var key = x.getAttribute("data-key");
  x.addEventListener("mousedown", pianoPress(x, true));
  x.addEventListener("mouseup", pianoPress(x, false));
  x.addEventListener("mouseout", pianoPress(x, false));
  x.addEventListener("touchstart", pianoPress(x, true));
  x.addEventListener("touchend", pianoPress(x, false));
});

function pianoPress(control, flag) {
  return function() {
    var note = control.getAttribute("data-note");
    if (flag == true) {
      control.classList.add("keypress");
      synth.triggerAttack(note);
      animateNote(note);
    } else {
      control.classList.remove("keypress");
      synth.triggerRelease(note);
    }
  };
}

function execAnimation(id, isSharp) {
  if (idArray.includes(id) == false) {
    idArray.push(id);
    if (isSharp) {
      anime({
        targets: [id],
        translateY: "-200",
        delay: 0,
        endDelay: 0,
        duration: 300,
        easing: "easeOutExpo",
        direction: "alternate",
        complete: function() {
          for (var i = 0; i < idArray.length; i++) {
            if (idArray[i] == id) {
              idArray.splice(i, 1);
            }
          }
        }
      });
    } else {
      anime({
        targets: [id],
        translateY: "200",
        delay: 0,
        endDelay: 0,
        duration: 300,
        easing: "easeOutExpo",
        direction: "alternate",
        complete: function() {
          for (var i = 0; i < idArray.length; i++) {
            if (idArray[i] == id) {
              idArray.splice(i, 1);
            }
          }
        }
      });
    }
  }
}

function animateNote(note) {
  var imgNote = document.querySelector('[data-note-name="' + note + '"]');
  var id = "#" + imgNote.id;
  var isSharp;
  if (note.includes("#")) {
    isSharp = true;
  } else {
    isSharp = false;
  }
  execAnimation(id, isSharp);
}

// function animateGear(flag) {
//   if (flag == true) {
//     gearAnim = anime({
//       targets: "#btnSettings",
//       rotate: "1turn",
//       loop: true
//     });
//   } else {
//     gearAnim.pause;
//   }
// }
