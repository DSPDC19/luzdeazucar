    document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-btn1');
    const nextBtn = document.querySelector('.carousel-btn2');
    const cardWidth = 510; 
    let index = 0;

    nextBtn.addEventListener('click', () => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      const move = (index + 1) * cardWidth;
      if (move <= maxScroll) {
        index++;
        track.style.transform = `translateX(-${index * cardWidth}px)`;
      }
    });

    prevBtn.addEventListener('click', () => {
      if (index > 0) {
        index--;
        track.style.transform = `translateX(-${index * cardWidth}px)`;
      }
    });
 });