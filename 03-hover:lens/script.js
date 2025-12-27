const lensWrapper = document.getElementById('lensWrapper');
        const lensContent = document.getElementById('lensContent');
        const lensOverlay = document.getElementById('lensOverlay');
        const lensZoom = document.getElementById('lensZoom');
        const zoomedImg = document.getElementById('zoomedImg');

        const ZOOM_FACTOR = 2;
        const LENS_SIZE = 150;

        let isHovering = false;

        lensWrapper.addEventListener('mouseenter', () => {
            isHovering = true;
        });

        lensWrapper.addEventListener('mouseleave', () => {
            isHovering = false;
        });

        lensWrapper.addEventListener('mousemove', (e) => {
            if (!isHovering) return;

            const rect = lensWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Position the lens circle
            const lensX = x - LENS_SIZE / 2;
            const lensY = y - LENS_SIZE / 2;

            lensOverlay.style.width = LENS_SIZE + 'px';
            lensOverlay.style.height = LENS_SIZE + 'px';
            lensOverlay.style.left = lensX + 'px';
            lensOverlay.style.top = lensY + 'px';

            // Calculate zoom positioning
            const imgRect = lensContent.querySelector('img').getBoundingClientRect();
            const imgWidth = imgRect.width;
            const imgHeight = imgRect.height;

            // Set zoomed image dimensions
            zoomedImg.style.width = (imgWidth * ZOOM_FACTOR) + 'px';
            zoomedImg.style.height = (imgHeight * ZOOM_FACTOR) + 'px';

            // Calculate the position to show in the lens
            // We want to center the zoomed portion where the mouse is
            const zoomX = -x * ZOOM_FACTOR + LENS_SIZE / 2;
            const zoomY = -y * ZOOM_FACTOR + LENS_SIZE / 2;

            zoomedImg.style.left = zoomX + 'px';
            zoomedImg.style.top = zoomY + 'px';
        });