import UIWindow from './UIWindow.js'
import update_username_in_gui from '../helpers/update_username_in_gui.js'

async function UIWindowChangeUsername(){
    const internal_id = window.uuidv4();
    let h = '';
    h += `<div class="change-username" style="padding: 20px; border-bottom: 1px solid #ced7e1;">`;
        // error msg
        h += `<div class="form-error-msg"></div>`;
        // success msg
        h += `<div class="form-success-msg"></div>`;
        // new username
        h += `<div style="overflow: hidden; margin-top: 10px; margin-bottom: 30px;">`;
            h += `<label for="confirm-new-username-${internal_id}">New Username</label>`;
            h += `<input id="confirm-new-username-${internal_id}" type="text" name="new-username" class="new-username" autocomplete="off" />`;
        h += `</div>`;

        // Change Username
        h += `<button class="change-username-btn button button-primary button-block button-normal">Change Username</button>`;
    h += `</div>`;

    const el_window = await UIWindow({
        title: 'Change Username',
        app: 'change-username',
        single_instance: true,
        icon: null,
        uid: null,
        is_dir: false,
        body_content: h,
        draggable_body: false,
        has_head: true,
        selectable_body: false,
        draggable_body: false,
        allow_context_menu: false,
        is_resizable: false,
        is_droppable: false,
        init_center: true,
        allow_native_ctxmenu: false,
        allow_user_select: false,
        width: 350,
        height: 'auto',
        dominant: true,
        show_in_taskbar: false,
        onAppend: function(this_window){
            $(this_window).find(`.new-username`).get(0)?.focus({preventScroll:true});
        },
        window_class: 'window-publishWebsite',
        body_css: {
            width: 'initial',
            height: '100%',
            'background-color': 'rgb(245 247 249)',
            'backdrop-filter': 'blur(3px)',
        }    
    })

    $(el_window).find('.change-username-btn').on('click', function(e){
        // hide previous error/success msg
        $(el_window).find('.form-success-msg, .form-success-msg').hide();

        const new_username = $(el_window).find('.new-username').val();

        if(!new_username){
            $(el_window).find('.form-error-msg').html('All fields are required.');
            $(el_window).find('.form-error-msg').fadeIn();
            return;
        }

        $(el_window).find('.form-error-msg').hide();

        // disable button
        $(el_window).find('.change-username-btn').addClass('disabled');
        // disable input
        $(el_window).find('.new-username').attr('disabled', true);
    
        $.ajax({
            url: api_origin + "/change_username",
            type: 'POST',
            async: true,
            headers: {
                "Authorization": "Bearer "+auth_token
            },
            contentType: "application/json",
            data: JSON.stringify({ 
                new_username: new_username, 
            }),				
            success: function (data){
                $(el_window).find('.form-success-msg').html('Username updated successfully.');
                $(el_window).find('.form-success-msg').fadeIn();
                $(el_window).find('input').val('');
                // update auth data
                update_username_in_gui(new_username);
                // update username
                window.user.username = new_username;
                // enable button
                $(el_window).find('.change-username-btn').removeClass('disabled');
                // enable input
                $(el_window).find('.new-username').attr('disabled', false);
            },
            error: function (err){
                $(el_window).find('.form-error-msg').html(html_encode(err.responseJSON?.message));
                $(el_window).find('.form-error-msg').fadeIn();
                // enable button
                $(el_window).find('.change-username-btn').removeClass('disabled');
                // enable input
                $(el_window).find('.new-username').attr('disabled', false);
            }
        });	
    })
}

export default UIWindowChangeUsername