import { Editor } from '@tinymce/tinymce-react';
import React from 'react';
import PropTypes from 'prop-types';

function RTE({ label, control, defaultValue = "" }) {
    const [content, setContent] = React.useState(defaultValue);

    return (
        <div className="w-full">
            {label && <label className="inline-block mb-1 pl-1">{label}</label>}
            
            <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                initialValue={defaultValue}
                value={content}
                init={{
                    branding: false,
                    height: 400,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    statusbar: false,
                    resize: false,
                    setup: (editor) => {
                        editor.on('change', () => {
                            const newContent = editor.getContent();
                            setContent(newContent);
                            if (control) {
                                control.onChange(newContent);
                            }
                        });
                    }
                }}
                onEditorChange={(newContent, editor) => {
                    setContent(newContent);
                    if (control) {
                        control.onChange(newContent);
                    }
                }}
            />
        </div>
    );
}

RTE.propTypes = {
    label: PropTypes.string,
    control: PropTypes.shape({
        onChange: PropTypes.func.isRequired
    }),
    defaultValue: PropTypes.string,
};

export default RTE;