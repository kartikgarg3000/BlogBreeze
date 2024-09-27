import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const PostForm = () => {
  const editorRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = editorRef.current.getContent();
    console.log(content); // Output content to console
    // Add your submission logic here (e.g., send to server)
  };

  return (
    <form onSubmit={handleSubmit}>
      <Editor
        apiKey='zcfhxtk5bqdfenzkqhvs7p0nzuvtvuduy9008c17l7c5w47s'
        onInit={(evt, editor) => editorRef.current = editor}
        init={{
          plugins: 'lists link image',
          toolbar: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image',
          height: 300,
        }}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default PostForm;
