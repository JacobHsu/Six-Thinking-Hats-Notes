/*
	Q: How to delete your Web SQL databases in Google Chrome?
	A: chrome://settings/cookies
*/


$(function () {

	 //function loaded(){} 
	 //loaded = function() {};
	 
	var db = null;

	
	$(document).ready(function(){
	
	    if (window.openDatabase) {
		   db = openDatabase('NoteTest','1.0','notes_db Database',1024*1024*2);
		} else {
			console.log("Failed to open database, make sure your browser supports HTML5 web storage");
		}

		loaded("white");
		loaded("red");
		loaded("yellow");
		loaded("black");
		loaded("green");
		loaded("blue");
		
	});
	 
	 loaded = function(notes) {
		db.transaction(function(tx){
	        
		    tx.executeSql("SELECT COUNT(*) FROM "+notes,[],function(result){
				loadNotes(notes);
			},function(tx,error){
				tx.executeSql("CREATE TABLE "+notes+" (id REAL UNIQUE, description TEXT, timestamp REAL)",[],function(result){
					loadNotes(notes);
				});
			});
			
		}); //end of transaction
		

	};


	 loadNotes = function(notes) {
		 db.transaction(function(tx){
			tx.executeSql("SELECT id, description FROM " +notes,[],function(tx,result){
			
				for(var i=0;i<result.rows.length;++i){
				
					var row = result.rows.item(i);

					var list_li = '<li id="'+row['id']+'" >'+row['description']+'<a href="#"class="event-close" id="event-close-'+notes+'"> &#10005;</a></li>';

					 //$('.event-list').append(list_li);
					 $('#event-list-'+notes).append(list_li);
					 
	
				}

			},function(tx,error){
				console.log("Failed to get notes- "+error.message);
			});
		});
	  };



	$('.event-list').slimscroll({
            height: '125px', //.css .event-list-block
            wheelStep: 20
        });
		
    //$('.evnt-input').keypress(function (e) {
	$('#evnt-input-white,#evnt-input-red,#evnt-input-yellow,#evnt-input-black,#evnt-input-green,#evnt-input-blue').keypress(function (e) {

        var p = e.which;
        var inText =  $(this).val();//$('.evnt-input').val();
        if (p == 13) {
            if (inText == "") {
                alert('Empty Field');
            } else {
			
			   	var this_timestamp = new Date().getTime();
				console.log("id- "+ $(this).attr( 'id' ).substring(11));
				var table_name = $(this).attr( 'id' ).substring(11);
		
				var note_id = this_timestamp;
				db.transaction(function(tx){
					tx.executeSql("INSERT INTO "+table_name+"(id, description, timestamp) VALUES(?,?,?)",[ note_id , inText, this_timestamp]);
					console.log("evnt-input "+inText + " id:"+note_id);
				});
				
				var list_li = '<li id="'+note_id+'" >'+inText+'<a href="#"class="event-close" id="event-close-'+table_name+'"> &#10005;</a></li>';
				
				 //$('.event-list').append(list_li);
				 $('#event-list-'+table_name).append(list_li);
				

            }
            $(this).val('');
            $('.event-list').scrollTo('100%', '100%', {
                easing: 'swing'
            });
            return false;
            e.epreventDefault();
            e.stopPropagation();
        }
    });
	

	
	$(document).on('click', '.event-close', function () {

	   var table_name = $(this).attr( 'id' ).substring(12);

		var li_id = $(this).closest("li").attr('id');
		$('#'+li_id).remove();

		console.log('event-close id='+li_id);
		db.transaction(function(tx){
			tx.executeSql("DELETE From "+table_name+" WHERE id ="+li_id);
		});

        return false;
    });
	

});





