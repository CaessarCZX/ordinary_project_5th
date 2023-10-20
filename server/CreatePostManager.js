document.getElementById('imageUpload').addEventListener('change', function(event) {
    var imagePreview = document.getElementById('imagePreview');
    var imageFile = event.target.files[0];
  
    var reader = new FileReader();
    reader.onload = function() {
      var img = new Image();
      img.src = reader.result;
      imagePreview.innerHTML = '';
      imagePreview.appendChild(img);
    }
    reader.readAsDataURL(imageFile);
});

function createPost() {
    var postContent = document.getElementById('createPostText').value;
  
    var formData = new FormData();
    formData.append('content', postContent);
  
    // Obtener la imagen seleccionada
    var imageInput = document.getElementById('imageUpload');
    var imageFile = imageInput.files[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }
  
    fetch('/create_post', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('Publicación creada con éxito!');
      } else {
        alert('Error al crear la publicación. Por favor, inténtalo de nuevo.');
      }
    })
    .catch(error => console.error('Error:', error));
}

document.getElementById('imageUpload').addEventListener('change', function(event) {
    var imagePreview = document.getElementById('imagePreview');
    var imageFile = event.target.files[0];
  
    var reader = new FileReader();
    reader.onload = function() {
      var img = new Image();
      img.src = reader.result;
      imagePreview.innerHTML = '';
      imagePreview.appendChild(img);
    }
    reader.readAsDataURL(imageFile);
  });