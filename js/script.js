$(function () {
	var currentDate = new Date();
	if(localStorage.getItem('username') == null) {
		$('#taskForm').hide();
		$('#login').click(function(e){
			e.preventDefault();
			var username = $('#name').val();
			localStorage.setItem('username', username);
			$('#loginForm').hide();
			//$('#login').hide();
			var hours = new Date().getHours();
			if (hours < 12) {
				$('#showName').append('Hello ' + localStorage.getItem('username') + ' !');
				showTaskForm();
			} else if ((hours >= 12) && (hours <= 17)){
				$('#showName').append('Good afternoon ' + localStorage.getItem('username') + ' !');
				showTaskForm();
			} else {
				$('#showName').append('Good evening ' + localStorage.getItem('username') + ' !');
				showTaskForm();
			}
		});
	} else {
		$('#loginForm').hide();
		//$('#login').hide();
		var hours = new Date().getHours();
		if (hours <= 12) {
			$('#showName').append('Hello ' + localStorage.getItem('username') + ' !');
			showTaskForm();
		} else if ((hours >= 12) && (hours <= 17)){
			$('#showName').append('Good afternoon ' + localStorage.getItem('username') + ' !');
			showTaskForm();
		} else {
			$('#showName').append('Good evening ' + localStorage.getItem('username') + ' !');
			showTaskForm();
		}
	}
	
	
	// Créer et stocker une nouvelle tâche au clic du bouton "Add" 
	
	$('#addTask').click(function(e){
		e.preventDefault();
		var li_nbr = $('li');
		var taskName = $('#taskName').val();
		var deadline = $('#deadline').val();
		if ((taskName == '') || (deadline == '')) {
			alert("You must write something!");
		} else {
			localStorage.setItem('taskName' + (li_nbr.length + 1), taskName);
			localStorage.setItem('deadline' + (li_nbr.length + 1), deadline);
			//<button type="button" class="btn btn-primary editButton-' + (li_nbr.length + 1) +'" data-toggle="modal" data-target="#exampleModal" data-whatever="'+localStorage.getItem('taskName' + (li_nbr.length + 1))+'/'+localStorage.getItem('deadline' + (li_nbr.length + 1))+'">Edit</button><span class="close">\u00D7</span>
			var li = '<li class="task-'+(li_nbr.length + 1)+'"><input type="checkbox" value="" class="checkIt"><span class="selectedTask">'+localStorage.getItem('taskName' + (li_nbr.length + 1))+'&nbsp;&nbsp;&nbsp;<span class="badge"></span></span><span class="selectedDeadline">'+localStorage.getItem('deadline' + (li_nbr.length + 1))+'</span><div class="tools"><i class="fa fa-edit editButton-' + (li_nbr.length + 1) +'" data-toggle="modal" data-target="#exampleModal" data-whatever="'+localStorage.getItem('taskName' + (li_nbr.length + 1))+'/'+localStorage.getItem('deadline' + (li_nbr.length + 1))+'"></i><i class="fa fa-trash-o close"></i></div> </li>';
			$('#taskList').append(li);
			
			criticalTask(li_nbr.length + 1);
						
			localStorage.setItem('li_nbr', li_nbr.length + 1);
		}
		
		$('#taskName').val('');
		$('#deadline').val('');
	});
	
	//Afficher toutes les tâches de l'utilisateur
	
	function showTaskForm() {
		var li_nbr = localStorage.getItem('li_nbr');
		//<div class="tools"><i class="fa fa-edit editButton-' + i +'" data-toggle="modal" data-target="#exampleModal" data-whatever="'+currentTask+'/'+currentDeadline+'"></i><i class="fa fa-trash-o close"></i></div>
		//<button type="button" class="btn btn-primary editButton-' + i +'" data-toggle="modal" data-target="#exampleModal" data-whatever="'+currentTask+'/'+currentDeadline+'">Edit</button>
		for(var i=1; i <= li_nbr; i++) {
			currentTask = localStorage.getItem('taskName' + i);
			currentDeadline = localStorage.getItem('deadline' + i);
			if ((currentTask != '') || (currentDeadline != '')) {
				var li = '<li class="task-' + i + '"><input type="checkbox" value="" class="checkIt"><span class="selectedTask">'+currentTask+'&nbsp;&nbsp;&nbsp;<span class="badge"></span></span><span class="selectedDeadline">'+currentDeadline+'</span><div class="tools"><i class="fa fa-edit editButton-' + i +'" data-toggle="modal" data-target="#exampleModal" data-whatever="'+currentTask+'/'+currentDeadline+'"></i><i class="fa fa-trash-o close"></i></div></li>';
				$('#taskList').append(li);
			
				criticalTask(i);
			
				if(localStorage.getItem('checkedTask' + i) == 'true') {
					$('.task-' + i).addClass('checked');
					$('.task-' + i + ' .checkIt').prop('checked', true);
				}
			}
			
		}
		
		$('#taskForm').show();
		
		deleteTask();
		
		//checkTask();
	}
	
	//Voir les tâches dépassées par le temps dans un autre style
	
	function criticalTask(indice) {
		//currentDate = currentDate.getFullYear() + '-' + (currentDate.getMonth()+ 1) + '-' + currentDate.getDate();
		var deadline = localStorage.getItem('deadline' + indice).split('-');
		var date = parseInt(deadline[2]);
		var month = parseInt(deadline[1]);
		var year = parseInt(deadline[0]);
		if((year <= parseInt(currentDate.getFullYear())) && (month <= parseInt(currentDate.getMonth()+ 1)) && (date < parseInt(currentDate.getDate()))) {
			//$('.task-' + indice).addClass('btn-danger');
			$('.task-' + indice + ' .badge').addClass('badge-danger');
			late = '<i class="fa fa-clock-o"></i>&nbsp;Late';
			$('.task-' + indice + ' .badge-danger').html(late);
		}
	}
	
	// Supprimer une tâche en cliquant sur le bouton close concerné
	
	function deleteTask() {
		$('#taskForm .close').each(function(index) {
			
			$(this).click(function() {
				var li = localStorage.getItem('li_nbr');
				$('.task-' + (index+1)).css('display', 'none');
				localStorage.setItem('taskName' + (index+1), '');
				localStorage.setItem('deadline' + (index+1), '');
				if($('.task-' + (index+1)).hasClass('checked')) {
					$('.task-' + (index+1)).removeClass('checked');
					$('.task-' + (index+1) + ' .checkIt').prop('checked', false);
					localStorage.removeItem('checkedTask' + (index+1));
				}
				var taskContent, deadlineContent;
				for(var j = index+1; j < li; j++) {
					taskContent = localStorage.getItem('taskName' + (j+1));
					deadlineContent = localStorage.getItem('deadline' + (j+1));
					localStorage.setItem('taskName' + j, taskContent);
					localStorage.setItem('deadline' + j, deadlineContent);
					if($('.task-' + (j+1)).hasClass('checked')) {
						localStorage.setItem('checkedTask' + j, true);
						$('.task-' + j + ' .checkIt').prop('checked', true);
						localStorage.removeItem('checkedTask' + (j+1));
					}
				}
				$('.task-' + (index+1)).remove();
				localStorage.removeItem('taskName' + li);
				localStorage.removeItem('deadline' + li);
				li--;
				localStorage.setItem('li_nbr', li);
			});
		});
	}
	
	
	// Marquer une tâche comme completée en cliquant dessus pour ajouter un symbole "checked" devant 
	
	$('#taskForm .checkIt').click(function() {
		checked_indice = parseInt($(this).parent().attr('class').split('-')[1].split(' ')[0]);
		if ($(this).is(':checked')) {
			$('.task-' + checked_indice).addClass('checked');
			localStorage.setItem('checkedTask' + checked_indice, true);
			console.log($('.task-' + checked_indice));
			console.log(localStorage.getItem('checkedTask' + checked_indice));
		} else {
			$('.task-' + checked_indice).removeClass('checked');
			localStorage.removeItem('checkedTask' + checked_indice);
			console.log($('.task-' + checked_indice));
			console.log(localStorage.getItem('checkedTask' + checked_indice));
		}
	});
	
	var taskList = $('#taskList');
	//taskList.click(function(event) {
	  //if (event.target.nodeName === 'LI') {
		//event.target.classList.toggle('checked');
		//object = event.target;
		//checked_indice = parseInt(object.getAttributeNode('class').value.split('-')[1].split(' ')[0]);
		//if($('.task-' + checked_indice).hasClass('checked')) {
			//localStorage.setItem('checkedTask' + checked_indice, true);
		//} else {
			//localStorage.removeItem('checkedTask' + checked_indice);
		//}
	  //}
	//});
	
	//Editer une tâche(contenu, date) via une fenêtre modale
	
	var editIndice;
	
	$('#exampleModal').on('show.bs.modal', function (event) {
		var button = $(event.relatedTarget);// Button that triggered the modal
		var recipient = button.data('whatever'); // Extract info from data-* attributes
		// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
		var modal = $(this);
		modal.find('.modal-title').text('Editing of ' + recipient.split('/')[0]);
		modal.find('.modal-body input[type="text"]').val(recipient.split('/')[0]);
		modal.find('.modal-body input[type="date"]').val(recipient.split('/')[1]);
		
		editIndice = parseInt(button.attr('class').split(' ')[2].split('-')[1]);
		console.log(button.attr('class').split(' ')[2].split('-')[1]);
	});
	
	//Fonction permettant d'enregistrer la modification
	$('#exampleModal #edit').on('click', function () {
		newTask = $('#exampleModal .modal-body #task-name').val();
		newDeadline =  $('#exampleModal .modal-body #end-date').val();
		$('.task-' + editIndice + ' .selectedTask').text(newTask);
		localStorage.setItem('taskName' + editIndice, newTask);
		$('.task-' + editIndice + ' .selectedDeadline').text(newDeadline);
		localStorage.setItem('deadline' + editIndice, newDeadline);
		criticalTask(editIndice);
	});
	
	//Masquer les tâches
	$('#taskMask').click(function(e) {
		e.preventDefault();
		taskList.toggleClass('d-none');
	});
	
	//Masquer les tâches en retard
	$('#lateTaskMask').click(function(e) {
		e.preventDefault();
		lateTask = $('li .badge-danger');
		for(var i=0; i < lateTask.length; i++) {
			if($('.task-' + (i+1) + ' .checkIt').is(':checked') === false) {
				$('.task-' + (i+1)).toggleClass('d-none');
				console.log($('.task-' + (i+1)));
			}
		}
		//$('.btn-danger:not(.checked)').toggleClass('d-none');
	});
});