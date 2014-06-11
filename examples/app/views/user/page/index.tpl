{%extends "user/page/layout.tpl" %}
{%block main%}


{%widget name="user:widget/users.tpl" pagelet_id="users"%}
{%widget name="user:widget/books.tpl" pagelet_id="books"%}

{%endblock%}