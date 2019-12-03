
//Uses the AJAX Script Manager to call the Page's static 'sayHi()' method, which returns a string
function myFunction()
{
    PageMethods.sayHi(onSucess, onError);

    //On a success it performs this action, result is output from the C# method
    function onSucess(result)
    {
        alert(result);
    }

    //On a fail it does this.
    function onError(result)
    {
        alert('Cannot process your request at the moment, please try later.');
    }
}

myFunction();