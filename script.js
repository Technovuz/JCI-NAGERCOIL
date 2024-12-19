
// const triangle = document.querySelector('.triangle');

// window.addEventListener('scroll', () => {
   
//     const scrollPosition = window.scrollY;


//     const newLeftPosition = 50 - scrollPosition * 0.2; 
//     const rotationAngle = scrollPosition * 1; 

  
//     triangle.style.left = `${newLeftPosition}%`;
//     triangle.style.transform = `translateX(-120%) rotate(${rotationAngle}deg)`;
// });




// const triangles = document.querySelector('.triangles');

// window.addEventListener('scroll', () => {
   
//     const scrollPosition = window.scrollY;


//     const newLeftPosition = 50 - scrollPosition * 0.2; 
//     const rotationAngle = scrollPosition * 1; 

  
//     triangle.style.left = `${newLeftPosition}%`;
//     triangle.style.transform = `translateX(-120%) rotate(${rotationAngle}deg)`;
// });






    // Add underline animation to all nav links and dropdown items
    document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
        // Set position: relative only once
        if (!link.style.position) {
            link.style.position = 'relative';
        }

        // Add underline on mouseenter
        link.addEventListener('mouseenter', () => {
            // Only add underline if it doesn't exist
            if (!link.querySelector('.underline')) {
                const underline = document.createElement('span');
                underline.classList.add('underline'); // Use a class for styling
                underline.style.position = 'absolute';
                underline.style.left = '0';
                underline.style.bottom = '0';
                underline.style.height = '2px';
                underline.style.width = '0';
                underline.style.backgroundColor = '#007bff';
                underline.style.transition = 'width 0.4s ease';
                link.appendChild(underline);
                setTimeout(() => {
                    underline.style.width = '100%';
                }, 0);
            }
        });

        // Remove underline on mouseleave
        link.addEventListener('mouseleave', () => {
            const underline = link.querySelector('.underline');
            if (underline) {
                underline.style.width = '0';
                underline.addEventListener('transitionend', () => {
                    underline.remove();
                });
            }
        });
    });

