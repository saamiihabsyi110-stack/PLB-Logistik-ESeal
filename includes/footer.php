    <!-- Footer Scripts -->
    <script src="assets/js/sim3d.js"></script>
    <script src="assets/js/app.js"></script>
    <script src="assets/js/command_nav.js"></script>
    <script src="assets/js/quick_sidebar.js"></script>
    <script>
        window.addEventListener('load', () => {
            if (typeof app !== 'undefined' && app.init) {
                app.init();
            }
        });
    </script>
</body>
</html>
