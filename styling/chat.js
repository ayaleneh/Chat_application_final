$(document).ready(function () {
  var socket = io.connect();
  //link for sending afile
  var siofu = new SocketIOFileUpload(socket);
  var group_chat=$("#group-chat")
  var login=$("#login")
  var message = $("#message")
  var button = $("#button")
  var output = $("#output")
  var join =$("#join")
  var name=$("#name")
  var people=$("#people")
  button.click(function (e) {
    e.preventDefault();
    socket.emit('send message', message.val(),function(data){
      alert(data)
    });
    message.val('')
  })
  socket.on('load old msgs',function(docs){
    for(let i=0;i<docs.length;i++){
      displayData(docs[i])
    }
    
  })
  socket.on('new message', function (data) {
    displayData(data)
  })

  //whisper
  socket.on('whisper',function(data){
    displayData(data)
  })

  function displayData(data){
    output.append('<p><strong>' + data.nick + ': </strong>' + data.msg + '</p>')
  }
  join.click(function(e){
    e.preventDefault();
    socket.emit('new_user',name.val(),function(data){
      if(data){
        group_chat.show()
        login.hide()
      }
      else{
        alert('the username already taken by somebody please try another')
      }
    })
    name.val('')
  })

  //
  socket.on('username',function(data){
    var html=''
    for(let i=0;i<data.length;i++){
      html+=data[i]+'<br/>'
    }
    people.html(html)
  })
  //file upload
  document.getElementById("upload_btn").addEventListener("click", siofu.prompt, false);
  siofu.listenOnInput(document.getElementById("upload_input"));
  siofu.listenOnDrop(document.getElementById("file_drop"));

  siofu.addEventListener("progress", function(event){
    var percent = event.bytesLoaded / event.file.size * 100;
    console.log("File is", percent.toFixed(2), "percent loaded");
  });

  siofu.addEventListener("complete", function(event){
    console.log(event.success);
    console.log(event.file);
  });
})







































































































































// $(document).ready(function(){
//   var socket=io()
//   socket.connect('localhost:5000')
//   $("#name").focus()
//   var output=$('#output')
//   var Send_button=$("#button")

//   //join

//   $("#join").click(function(e){
//     e.preventDefault();
//     var name=$("#name").val();
//     if(name!==''){
//       socket.emit('join',name,function(data){
//         if(data){
//           $("#login").hide()
//           $("#group-chat").show()
//         }
//         else{
//           alert("the username already taken try another")
//         }
//       })
//       $("#name").val('')
//     }
//   })

//   //join_enter button


//   // $("#name").keypress(function(e){
//   //   if(e.which===13){
//   //     e.preventDefault();
//   //     var name=$("#name").val();
//   //     if(name!==''){
//   //       socket.emit('join',name,function(data){
//   //         if(data){
//   //           $("#login").hide()
//   //           $("#group-chat").show()
//   //         }
//   //         else{
//   //           alert("the username already taken try another")
//   //         }
//   //       })
//   //       $("#name").val('')
//   //   }
//   // })



//   //message


//   $('#message').focus()
//   Send_button.click(function(event){
//     event.preventDefault()
//     var msg = $("#message").val();
//     if(msg!==''){
//       socket.emit("send", msg);
//     }
//     $("#message").val("")
//   })
//   $("#message").keypress(function(e){
//     if(e.which === 13) {
//       var msg = $("#message").val();
//       if(msg!==''){
//         socket.emit("send", msg);
//       }
//       $("#message").val("");
//     }
//   })



//   socket.on('chat',function(data){
//     output.innerHTML =output.innerHTML+ '<p><strong>' + data.nick + ': </strong>' + data.msg + '</p>';
//   })

//   socket.on('joinlist',function(data){
//     var html=''
//     for(let i=0;i<data.length;i++){
//       html+=data[i]+'<br/>'
//     }
//     $("#msgs").html(html)
//   })  
// })