// function that will check if our invite link is expired
// and hide the link and description if it is expired
function engagement_invitation_expire(){

    // grab current date and invitation expiration date
    var current_date = new Date();
    var invitation_expiration_date = new Date("May 1, 2019 00:00:00");

    // if current date is greater than our expiration date,
    // that means our invite has expired. let's hide it
    if(current_date.getTime() > invitation_expiration_date.getTime()){
        
        // grab all of our `engagement-invite` elements
        var engagement_invitation_elements_to_hide = document.getElementsByClassName('engagement-invite');

        // loop through all of our `engagement-invite` elements and hide them
        for(var i = 0; i < engagement_invitation_elements_to_hide.length; i++){

            engagement_invitation_elements_to_hide[i].style.display = 'none';

        }

    }

}

engagement_invitation_expire();