<!DOCTYPE html>
<html lang="ru">
    <head>
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-PCC2LJRX');</script>
        <!-- End Google Tag Manager -->

        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>JUMYSTAP</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="ttps://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">

        <!-- Icon -->
        <link rel="apple-touch-icon" sizes="180x180" href="https://jumystap.kz/icon.svg">
        <link rel="icon" type="image/png" sizes="32x32" href="https://jumystap.kz/icon.svg">
        <link rel="icon" type="image/png" sizes="16x16" href="https://jumystap.kz/icon.svg">

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PCC2LJRX"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->

        @inertia
    </body>
</html>

