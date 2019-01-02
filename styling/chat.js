$(document).ready(function(){
  var socket=io()
  var output=document.getElementById('output')
  socket.connect('localhost:5000')

  $("#group-chat").hide()
  $("#row").hide()
  $("#name").focus()
  $("form").submit(function(event){
    event.preventDefault()
  })
  $("#join").click(function(){
    var name=$("#name").val();
    if(name!==''){
      socket.emit('join',name)
      $("#login").detach()
      $("#group-chat").show()
      $("#user_name").focus()
    }
  })
  $("#name").keypress(function(e){
    if(e.which===13){
      var name=$("#name").val()
      if(name!==''){
        socket.emit('join',name)
        $("#login").detach()
        $("#group-chat").show()
        $("#user_name").focus()
      }
    }
  })
  socket.on('update-people',function(people){
    
    $("#people").empty()
    $.each(people,function(clinet_id,name){
      $("#people").append("<li>"+name+"</li>")
    })
    
  })
  $("#send").click(function(){
    var msg = $("#message").val();
    if(msg!==''){
      socket.emit("send", msg);
    }
    
    $("#message").val("");
  });
  $("#message").keypress(function(e){
    if(e.which === 13) {
      var msg = $("#message").val();
      if(msg!==''){
        socket.emit("send", msg);
      }
      $("#message").val("");
    }
  });

  socket.on("disconnect", function(){
    $("#msgs").append("<li><strong><span class='text-warning'>The server is not available</span></strong></li>");
    $("#message").attr("disabled", "disabled");
    $("#send").attr("disabled", "disabled");
  });
  // var message=document.getElementById('message'),
  //   //user_name=document.getElementById('user_name'),
 
  //   button=document.getElementById('send')

  // button.addEventListener('click',function(){
  //   socket.emit('group_chat',{
  //     // user_name:user_name.value,
  //     message:message.value
  //   })
  // })
  socket.on('chat',function(who,data){
    output.innerHTML =output.innerHTML+ '<p><strong>' + who + ': </strong>' + data + '</p>';
  })
})