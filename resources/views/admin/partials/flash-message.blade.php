<script src="{{ asset('admin/assets/js/plugins/sweetalert2/sweetalert2.js') }}"></script>
<script src="{{ asset('admin/assets/js/plugins/toastr/toastr.min.js') }}"></script>

@if (session('success'))
    <script>
        $(function() {
            toastr.success('{{ session('success') }}');
        });
    </script>
@endif

@if (session('error'))
    <script>
        $(function() {
            toastr.error('{{ session('error') }}');
        });
    </script>
@endif
