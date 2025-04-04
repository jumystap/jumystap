@push('scripts')
    <script src="https://cdn.tiny.cloud/1/si7sjwf48hygx183hecv6xhxli757d0xb2h16bsygufg2x0w/tinymce/5/tinymce.min.js"
            referrerpolicy="origin"></script>
    <script>
        var editor_config = {
            path_absolute: "{{ config('app.url') }}/",
            height: 500,
            language: 'ru',
            selector: 'textarea.tinymce-editor',
            relative_urls: false,
            remove_script_host: false,
            convert_urls: true,
            force_br_newlines: false,
            force_p_newlines: false,
            forced_root_block: '',
            entity_encoding: 'raw',
            image_caption: true,
            image_description: true,
            image_title: true,
            plugins: [
                "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                "searchreplace wordcount visualblocks visualchars code fullscreen",
                "insertdatetime media nonbreaking save table directionality",
                "emoticons template paste textpattern",
                "code preview"
            ],
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | code preview",
            file_picker_callback: function (callback, value, meta) {
                var x = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
                var y = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;

                var cmsURL = editor_config.path_absolute + 'laravel-filemanager?editor=' + meta.fieldname;
                if (meta.filetype == 'image') {
                    cmsURL = cmsURL + "&type=Images";
                } else {
                    cmsURL = cmsURL + "&type=Files";
                }

                tinyMCE.activeEditor.windowManager.openUrl({
                    url: cmsURL,
                    title: 'Filemanager',
                    width: x * 0.8,
                    height: y * 0.8,
                    resizable: "yes",
                    close_previous: "no",
                    onMessage: (api, message) => {
                        callback(message.content);
                    }
                });
            }
        };

        tinymce.init(editor_config);
    </script>
@endpush
