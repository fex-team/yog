{%html%}
    {%head%}
        <title> This is a Yog demo</title>
        {%script%}
            function t() {
                console.log('test');
            }
        {%endscript%}
    {%endhead%}
    {%body%}
        <p>
            <h1> hello fis! </h1>
        </p>
        {%widget "test:widget/widget0.tpl" with widget0_obj%}
    {%endbody%}
{%endhtml%}