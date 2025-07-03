window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Robot Deployment video randomizer and shuffler
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    function getVideoFilesFromResults(callback) {
      // List all .mp4 files in results (hardcoded for static hosting)
      callback([
        'results/0503.mp4',
        'results/Pick-and-Place-Franka-Demo.mp4',
        'results/robot1.mp4',
        'results/robot2.mp4'
      ]);
    }

    function setupRobotDeploymentVideos() {
      getVideoFilesFromResults(function(videoFiles) {
        if (videoFiles.length < 2) return;
        shuffleArray(videoFiles);
        let idx1 = 0, idx2 = 1;
        const container = $('#robot-deploy-videos');
        container.empty();
        // Create two video elements using plain JS for reliability
        const video1 = document.createElement('video');
        video1.className = 'robot-deploy-video';
        video1.muted = true;
        video1.autoplay = true;
        video1.loop = false;
        video1.playsInline = true;
        video1.controls = false;
        video1.style.height = '200px';
        video1.style.width = 'auto';
        video1.style.background = '#eee';
        video1.style.display = 'block';
        video1.style.margin = '0 auto';
        const source1 = document.createElement('source');
        source1.src = videoFiles[idx1];
        source1.type = 'video/mp4';
        video1.appendChild(source1);

        const video2 = document.createElement('video');
        video2.className = 'robot-deploy-video';
        video2.muted = true;
        video2.autoplay = true;
        video2.loop = false;
        video2.playsInline = true;
        video2.controls = false;
        video2.style.height = '200px';
        video2.style.width = 'auto';
        video2.style.background = '#eee';
        video2.style.display = 'block';
        video2.style.margin = '0 auto';
        const source2 = document.createElement('source');
        source2.src = videoFiles[idx2];
        source2.type = 'video/mp4';
        video2.appendChild(source2);

        container[0].appendChild(video1);
        container[0].appendChild(video2);

        // Helper to pick a new index not currently shown
        function pickNextIndex(excludeIdx) {
          let idx;
          if (videoFiles.length === 2) {
            idx = excludeIdx === 0 ? 1 : 0;
          } else {
            do {
              idx = Math.floor(Math.random() * videoFiles.length);
            } while (idx === excludeIdx);
          }
          return idx;
        }

        function swapVideo(videoElem, sourceElem, currentIdx, otherIdx) {
          let nextIdx = pickNextIndex(otherIdx);
          sourceElem.src = videoFiles[nextIdx];
          videoElem.load();
          videoElem.play();
          return nextIdx;
        }

        // When a video ends, swap to a new random video (not the same as the other)
        video1.addEventListener('ended', function() {
          idx1 = swapVideo(video1, source1, idx1, idx2);
        });
        video2.addEventListener('ended', function() {
          idx2 = swapVideo(video2, source2, idx2, idx1);
        });

        // Start both videos after DOM insertion
        setTimeout(function() {
          video1.play();
          video2.play();
        }, 100);
      });
    }

    setupRobotDeploymentVideos();
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      autoplaySpeed: 3000,
    }

    // Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
      // Add listener to  event
      carousels[i].on('before:show', state => {
        console.log(state);
      });
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
      // bulmaCarousel instance is available as element.bulmaCarousel
      element.bulmaCarousel.on('before-show', function(state) {
        console.log(state);
      });
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // Video synchronization and scene transition
    const scenes = ['outdoors', 'kitchen', 'c3', 'b2', 'bottles', 'cans'];
    let currentSceneIndex = 0;

    function showScene(sceneIndex) {
        $('.video-row').hide();
        const scene = scenes[sceneIndex];
        const $currentRow = $(`.video-row[data-scene="${scene}"]`);
        $currentRow.show();
        
        // Get all videos in the current row
        const videos = $currentRow.find('video').get();
        
        // Reset and play all videos
        videos.forEach(video => {
            video.currentTime = 0;
            video.play();
        });

        // Sync playback
        videos.forEach(video => {
            video.onplay = () => {
                videos.forEach(v => {
                    if (Math.abs(v.currentTime - video.currentTime) > 0.3) {
                        v.currentTime = video.currentTime;
                    }
                });
            };
        });

        // When videos end, show next scene
        videos[0].onended = () => {
            currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
            showScene(currentSceneIndex);
        };
    }

    // Start with a random scene
    currentSceneIndex = Math.floor(Math.random() * scenes.length);
    showScene(currentSceneIndex);
});
