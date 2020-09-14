$(init);

$(window).resize(resizeAdjust);

function resizeAdjust() {
  $(".wrapper").height($("svg").height());
  $(".wrapper").width($("svg").width());

  $(".element").each((index, elem) => {
    elem.style.height = $(`#${index + 1}`)[0].getBoundingClientRect().height + "px";
    elem.style.width = $(`#${index + 1}`)[0].getBoundingClientRect().width + "px";
    elem.style.left = ($(`#${index + 1}`)[0].getBoundingClientRect().left-$(".wrapper")[0].getBoundingClientRect().left)+"px";
    elem.style.top = ($(`#${index + 1}`)[0].getBoundingClientRect().top-$(".wrapper")[0].getBoundingClientRect().top)+"px";
  });

  $(".cell2").each((index, elem) => {
    $(`#cell${index}`).height($(elem)[0].getBoundingClientRect().height);
    $(`#cell${index}`).width($(elem)[0].getBoundingClientRect().width);
    $(`#cell${index}`).css("left", $(elem)[0].getBoundingClientRect().left-$(".wrapper")[0].getBoundingClientRect().left);
    $(`#cell${index}`).css("top", $(elem)[0].getBoundingClientRect().top-$(".wrapper")[0].getBoundingClientRect().top);
  });

  $("#sendGame").css("top", $("#6")[0].getBoundingClientRect().top-$(".wrapper")[0].getBoundingClientRect().top);
  $("#sendGame").css("left", $("#cell17")[0].getBoundingClientRect().left-$(".wrapper")[0].getBoundingClientRect().left);
}

function init() {
  $("#sendGame").click(() => {
    generateCoords();
    latest();
  });

  $(".wrapper").height($("svg").height());
  $(".wrapper").width($("svg").width());

  for(var i=0;i<11;i++){
    var txt = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
      x:806+50*i,
      y:297,
    });
    txt[0].style.fontFamily="Quicksand";
    txt[0].textContent=i+1;
    $('g')[0].append(txt[0]);
    for(var j=0;j<6;j++){
      var cell = $(document.createElementNS("http://www.w3.org/2000/svg", "rect")).attr({
          class:"cell2",
          x:760.33+i*50.67,
          y:249.25-j*27.5,
          width:50.67,
          height:27.5,
          fill:"none",
          stroke:"none",
          pointerEvents:"all",
      });
      var el = $(document.createElementNS("http://www.w3.org/2000/svg", "ellipse")).attr({
        cx:811+50.67*i,
        cy:249.25-27.5*j,
        rx:2,
        ry:2,
        fill:"#000",
        stroke:"none",
      });
      $('g')[0].append(cell[0]);
      $('g')[0].append(el[0]);
    }
  }
  for(var i=0;i<6;i++){
    var txt = $(document.createElementNS("http://www.w3.org/2000/svg", "text")).attr({
      x:740,
      y:257-27.5*i,
    });
    txt[0].style.fontFamily="Quicksand";
    txt[0].textContent=i+1;
    $('g')[0].append(txt[0]);
  }
  $(".cell2").each((index, elem) => {
    $(".wrapper").prepend(`<div id="cell${index}" class="cellOverlay"></div>`);
    $(`#cell${index}`).height($(elem)[0].getBoundingClientRect().height);
    $(`#cell${index}`).width($(elem)[0].getBoundingClientRect().width);
    $(`#cell${index}`).css("left", $(elem)[0].getBoundingClientRect().left-$(".wrapper")[0].getBoundingClientRect().left);
    $(`#cell${index}`).css("top", $(elem)[0].getBoundingClientRect().top-$(".wrapper")[0].getBoundingClientRect().top);
  });

  $("#sendGame").css("top", $("#6")[0].getBoundingClientRect().top-$(".wrapper")[0].getBoundingClientRect().top);
  $("#sendGame").css("left", $("#cell6")[0].getBoundingClientRect().left-$(".wrapper")[0].getBoundingClientRect().left);

  $(".element").each((index, elem) => {
    elem.style.height = $(`#${index + 1}`)[0].getBoundingClientRect().height + "px";
    elem.style.width = $(`#${index + 1}`)[0].getBoundingClientRect().width + "px";
    elem.style.left = ($(`#${index + 1}`)[0].getBoundingClientRect().left-$(".wrapper")[0].getBoundingClientRect().left)+"px";
    elem.style.top = ($(`#${index + 1}`)[0].getBoundingClientRect().top-$(".wrapper")[0].getBoundingClientRect().top)+"px";
  });

  $(".drag").draggable({
    start: function (event, ui) {
      ui.helper[0].style.border = "solid black 0px";
      ui.helper.data("origin", ui.helper[0].getBoundingClientRect());
    },
    snap: ".cellOverlay",
    revert: "invalid",
    snapMode: "inner",
    snapTolerance: 40,
    scroll: false,
  });

  $(".wrapper").droppable({
    drop: handleElementDrop,
  });
}

function handleElementDrop(event, ui) {
  dragger = ui.draggable;
  if (
    !insideTopLeftBottomBounds(dragger) ||
    !checkOrder(dragger) ||
    checkOverlap(dragger) 
  ) {
    dragger.animate(
      {
        top: dragger.data().origin.top-$(".wrapper")[0].getBoundingClientRect().top,
        left: dragger.data().origin.left-$(".wrapper")[0].getBoundingClientRect().left,
      },
      "slow"
    );
  }
}

function checkOverlap(dragged) {
  let overlap = false;
  dragged.siblings(".element").each((index, n) => {
    overlap |= !(
      dragged[0].getBoundingClientRect().right <
        n.getBoundingClientRect().left + 10 ||
      dragged[0].getBoundingClientRect().left + 10 >
        n.getBoundingClientRect().right ||
      dragged[0].getBoundingClientRect().bottom <
        n.getBoundingClientRect().top + 10 ||
      dragged[0].getBoundingClientRect().top + 10 >
        n.getBoundingClientRect().bottom
    );
  });
  if (overlap) {
    $.jGrowl("Tasks must not overlap");
  }
  return overlap;
}

function insideTopLeftBottomBounds(dragged) {
  let top = $("#cell5")[0].getBoundingClientRect().top;
  let left = $("#cell5")[0].getBoundingClientRect().left;
  let bottom = $("#cell0")[0].getBoundingClientRect().bottom;
  let cond =
    dragged[0].getBoundingClientRect().top >= top - 10 &&
    dragged[0].getBoundingClientRect().left >= left - 10 &&
    dragged[0].getBoundingClientRect().bottom <= bottom + 10;
  if (!cond) {
    $.jGrowl("Dragged out of bounds");
  }
  top = $("#cell4")[0].getBoundingClientRect().top;
  let cond5resources =
    dragged[0].getBoundingClientRect().top >= top - 10 &&
    dragged[0].getBoundingClientRect().left >= left - 10 &&
    dragged[0].getBoundingClientRect().bottom <= bottom + 10;
  if (!cond5resources && cond) {
    $.jGrowl("Cannot have more than 5 resources");
  }
  return cond && cond5resources;
}

function getDroppedLocations() {
  let draggedElements = [];
  let left = $("#cell5")[0].getBoundingClientRect().left;
  let top = $("#cell5")[0].getBoundingClientRect().top;
  let bottom = $("#cell60")[0].getBoundingClientRect().bottom;

  $(".element").each((index, elem) => {
    if (
      elem.getBoundingClientRect().left >= left - 10 &&
      elem.getBoundingClientRect().top >= top - 10 &&
      elem.getBoundingClientRect().bottom <= bottom + 10
    ) {
      draggedElements.push(elem);
    }
  });
  return draggedElements;
}

function generateCoords() {
  let draggedElements = getDroppedLocations();
  let xCoord = 0;
  let yCoord = 0;

  let config = {};
  var ref = $("#cell0")[0].getBoundingClientRect();
  draggedElements.forEach((elem) => {
    xCoord = Math.round((elem.getBoundingClientRect().left-ref.left) / ref.width);
    yCoord = Math.round(-(elem.getBoundingClientRect().top-ref.top) / ref.height);
    let id = $(elem)[0].id;
    config[id] = { xCoord, yCoord };
  });
  console.log(config);
}

function latest() {
  let draggedElements = getDroppedLocations();
  var rightmost = 0;
  var valid = 0;
  draggedElements.forEach((elem) => {
    rightmost = (elem.getBoundingClientRect().right > rightmost) ? elem.getBoundingClientRect().right : rightmost;
    valid += 1;
  });
  if (rightmost && valid == 7) {
    location.href = "https://www.aurorascheduling.com/why-optimize?utm_source=game&utm_medium=website&utm_campaign=game&utm_content=" +
        Math.round((rightmost - $("#cell0")[0].getBoundingClientRect().left)/$("#cell0")[0].getBoundingClientRect().width) + "#solutions";
  } else {
    $.jGrowl("Must drag all elements onto the grid")
  }
}

function checkOrder(dragged) {
  let validate = true;
  let found = null;
  switch (dragged[0].id) {
    case "A1":
      found = getDroppedLocations().filter(
        (element) => element.id == "A2" || element.id == "A3"
      );
      if (found.length > 0) {
        let left = 9990;
        found.forEach((n) => {
          if (n.getBoundingClientRect().left < left) {
            left = n.getBoundingClientRect().left;
          }
        });
        if (dragged[0].getBoundingClientRect().right > left + 20) {
          $.jGrowl("A1 has to be before A2 and A3");
          validate = false;
        }
      }
      break;
    case "D1":
      found = getDroppedLocations().filter((element) => element.id == "D2");
      if (found.length > 0) {
        let left = 9990;
        found.forEach((n) => {
          if (n.getBoundingClientRect().left < left) {
            left = n.getBoundingClientRect().left;
          }
        });
        if (dragged[0].getBoundingClientRect().right > left + 20) {
          $.jGrowl("D1 has to be before D2");
          validate = false;
        }
      }
      break;
    case "A2":
      found = getDroppedLocations().filter(
        (element) => element.id == "A1" || element.id == "A3"
      );
      if (found.length > 0) {
        found.forEach((n) => {
          if (n.id == "A1") {
            if (
              dragged[0].getBoundingClientRect().left <
              n.getBoundingClientRect().right - 20
            ) {
              $.jGrowl("A2 has to be after A1");
              validate = false;
            }
          } else if (n.id == "A3") {
            if (
              dragged[0].getBoundingClientRect().right >
              n.getBoundingClientRect().left + 20
            ) {
              $.jGrowl("A2 has to be before A3");
              validate = false;
            }
          }
        });
      }
      break;
    case "A3":
      found = getDroppedLocations().filter(
        (element) => element.id == "A1" || element.id == "A2"
      );
      if (found.length > 0) {
        let right = 0;
        found.forEach((n) => {
          if (n.getBoundingClientRect().right > right) {
            right = n.getBoundingClientRect().right;
          }
        });
        if (dragged[0].getBoundingClientRect().left < right - 20) {
          validate = false;
          $.jGrowl("A3 has to be after A1 and A2");
        }
      }
      break;
    case "D2":
      found = getDroppedLocations().filter((element) => element.id == "D1");
      if (found.length > 0) {
        let right = 0;
        found.forEach((n) => {
          if (n.getBoundingClientRect().right > right) {
            right = n.getBoundingClientRect().right;
          }
        });
        if (dragged[0].getBoundingClientRect().left < right - 20) {
          $.jGrowl("D2 has to be after D1");
          validate = false;
        }
      }
      break;
  }
  return validate;
}
