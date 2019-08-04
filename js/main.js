$.fn.P4 = function(col_nbr, row_nbr, p1token, p2token)
{   
    /* 
    **  Main function using 4 parameters
    **  @param col_nbr (int) : number of columns defined on plugin call
    **  @param row_nbr (int) : number of row defined on plugin call
    **  @param p1token (string) : token color of the first player, defined on plugin call
    **  @param p2token (string) : token color of the second player, defined on plugin call 
    */
    class GameBoard
    {
        constructor(col_nbr, row_nbr, p1token, p2token)
        {
            this.col_nbr = col_nbr;
            this.row_nbr = row_nbr;
            this.p1token = p1token;
            this.p2token = p2token;
        }
        
        /*
        ** Function to display the grid on the HTML page
        ** Creates a div containing an id with different row number
        ** and adds as many canvas (circle) as needed in each row
        */
        display_grid(col_nbr, row_nbr)
        {
            $('body').css('background-color', 'lightgrey');
            var section = $('<div class=display style="margin-top: 50px;"></div>');
            var p = $('<div class=paragraph style="color: black; font-size: 3em; text-align: center;">PUISSANCE 4</div>');
            var actualPlayer = $('<div class=display_player style="color: black; font-size: 1em; text-align: center; margin-top: 30px;">C\'est au tour de : Joueur 1</div>');
            var victory = $('<div class=victory style="color: black; font-size: 1em; text-align: center; margin-top: 30px;">Victoires : </div>');
            var displayPlayer1 = $('<div class=display_player1 style="color: black; font-size: 1em; text-align: center; margin-top: 30px;">Joueur 1 : 0</div>');
            var displayPlayer2 = $('<div class=display_player2 style="color: black; font-size: 1em; text-align: center; margin-top: 30px;">Joueur 2 : 0</div>');
            $('body').append(section);
            $(section).before(p);
            $(p).after(actualPlayer);
            $(actualPlayer).after(victory);
            $(victory).after(displayPlayer1);
            $(displayPlayer1).after(displayPlayer2);
            
            for(var row_count = 1; row_count <= row_nbr; row_count++)
            {
                var div = $('<div id=row-'+ row_count + ' style="margin-top: -5px; display:flex; justify-content:center"></div>');
                $('.display').prepend(div);
            
                for(var col_count = 1; col_count <= col_nbr; col_count++)
                {
                    var circle = $('<canvas value=0 class="empty neutral" data-col=' + col_count + ' data-row=' + row_count + ' width="100px" height="100px"/>');
                    var ctx = circle[0].getContext('2d');
                    $('#row-' + row_count).append(circle);
                    ctx.fillStyle = 'blue';
                    ctx.beginPath();
                    ctx.fillRect(0,0,150,150);
                    ctx.fillStyle = 'white';
                    ctx.beginPath();
                    ctx.arc(50,50,40,0,2*Math.PI);
                    ctx.fill();
                }
            }
        }
    }

    class play
    {
        constructor()
        {
            this.p1value = 1;
            this.p2value = 2;
            this.player1 = p1token;
            this.player2 = p2token;
            this.currentPlayer = 1;
        }

        insert_tokens(self)
        {
            /*  
            **  Instancing a new variable
            **  because 'this' has no value within an unknown function
            */
            var play = this;
            var checkedCol = $(self).data('col');
            var filledCells = 0;   

            if(play.currentPlayer == 1)
            {
                var color = play.player1;
                var playervalue = play.p1value;
            }
            else
            {
                var color = play.player2;
                var playervalue = play.p2value;
            }
            for(var i = 1; i <= row_nbr; i++)
            {
                var cel = $('[data-col='+checkedCol+'][data-row='+i+']');
                var value = $(cel).attr('value');
                if(value == 0)
                {
                    var canvas = $(cel)[0];                           
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(50,50,40,0,2*Math.PI);
                    ctx.fill();
                    $(cel).attr('value', playervalue);
                    $(cel).removeClass('empty');
                    $(cel).addClass('filled')
                    play.switch_players();
                    return cel;
                }
                else
                {
                    filledCells ++;
                    if(filledCells == row_nbr)
                    {
                        alert('La ligne est pleine');
                    }
                }
            }   
        }
        
        switch_players()
        {
            if(this.currentPlayer == 1)
            {
                this.currentPlayer = 2;
                $('.display_player').html('C\'est au tour de : Joueur ' + this.currentPlayer);
            }
            else
            {
                this.currentPlayer = 1;
                $('.display_player').html('C\'est au tour de : Joueur ' + this.currentPlayer);
            }
        }

        horizontal_check(activ_cel)
        {
            var colpos = $(activ_cel).data('col');
            var activcel_val = $(activ_cel).attr('value');
            var colmin = colpos - 3;
            var colmax = colpos + 3;
            var rowpos = $(activ_cel).data('row');
            var series = 0;
            var filledCells = 0;
            var gameover = 0;
            var victory = 0;

            if(colmin < 1)
            {
                colmin = 1;
            }
            if(colmax > col_nbr)
            {
                colmax = col_nbr;
            }
            for(var i = colmin; i <= colmax; i++)
            {
                var cel = $('[data-col='+i+'][data-row='+rowpos+']');
                var value = $(cel).attr('value');
                if(value == activcel_val)
                {
                    series ++;
                }
                else
                {
                    series = 0;
                }
                if(series == 4)
                {
                    alert('Joueur ' + activcel_val + ' a gagné la partie');
                    if(activcel_val == 1)
                    {
                        victory ++;
                        $('.display_player1').html('Joueur 1 : ' + victory);
                    }
                    else if(activcel_val == 2)
                    {
                        victory ++;
                        $('.display_player2').html('Joueur 2 : ' + victory);
                    }
                }
            }
        }

        vertical_check(activ_cel)
        {
            var colpos = $(activ_cel).data('col');
            var activcel_val = $(activ_cel).attr('value');
            var rowpos = $(activ_cel).data('row');
            var rowmin = rowpos - 3;
            var rowmax = rowpos + 3;
            var series = 0;
            var victory = 0;

            if(rowmin < 1)
            {
                rowmin = 1;
            }
            if(rowmax > row_nbr)
            {
                rowmax = row_nbr;
            }
            for(var i = rowmin; i <= rowmax; i++)
            {
                var cel = $('[data-col='+colpos+'][data-row='+i+']');
                var value = $(cel).attr('value');
                if(value == activcel_val)
                {
                    series ++;
                }
                else
                {
                    series = 0;
                }
                if(series == 4)
                {
                    alert('Joueur ' + activcel_val + ' a gagné la partie');
                    if(activcel_val == 1)
                    {
                        victory ++;
                        $('.display_player1').html('Joueur 1 : ' + victory);
                    }
                    else if(activcel_val == 2)
                    {
                        victory ++;
                        $('.display_player2').html('Joueur 2 : ' + victory);
                    }
                }
            }
        }

        diag1_check(activ_cel)
        {
            var colpos = $(activ_cel).data('col');
            var activcel_val = $(activ_cel).attr('value');
            var rowpos = $(activ_cel).data('row');
            var rowmin = colpos - 3;
            var rowmax = colpos + 3;
            var series = 0;
            var victory = 0;

            if(rowmin < 1)
            {
                rowmin = 1;
            }
            if(rowmax > row_nbr)
            {
                rowmax = row_nbr;
            }
            for(var i = rowmin; i <= rowmax; i++)
            {
                var cel = $('[data-col='+i+'][data-row='+i+']');
                var value = $(cel).attr('value');
                if(value == activcel_val)
                {
                    series ++;
                }
                else
                {
                    series = 0;
                }
                if(series == 4)
                {
                    alert('Joueur ' + activcel_val + ' a gagné la partie');
                    if(activcel_val == 1)
                    {
                        victory ++;
                        $('.display_player1').html('Joueur 1 : ' + victory);
                    }
                    else if(activcel_val == 2)
                    {
                        victory ++;
                        $('.display_player2').html('Joueur 2 : ' + victory);
                    }
                }
            }
        }

        diag2_check(activ_cel)
        {
            var colpos = $(activ_cel).data('col');
            var activcel_val = $(activ_cel).attr('value');
            var rowpos = $(activ_cel).data('row');
            var colmin = colpos - 3;
            var colmax = colpos + 3;
            var rowmin = rowpos - 3;
            var rowmax = rowpos + 3;
            var series = 0;
            var victory = 0;

            if(rowmin < 1)
            {
                rowmin = 1;
            }
            if(rowmax > row_nbr)
            {
                rowmax = row_nbr;
            }
            if(colmin < 1)
            {
                colmin = 1;
            }
            if(colmax > col_nbr)
            {
                colmax = col_nbr;
            }
            var j = colmax;
            for(var i = rowmin; i <= rowmax; i++)
            {
                var cel = $('[data-col='+j+'][data-row='+i+']');
                var value = $(cel).attr('value');
                if(value == activcel_val)
                {
                    series ++;
                }
                else
                {
                    series = 0;
                }
                if(series == 4)
                {
                    alert('Joueur ' + activcel_val + ' a gagné la partie');
                    if(activcel_val == 1)
                    {
                        victory ++;
                        $('.display_player1').html('Joueur 1 : ' + victory);
                    }
                    else if(activcel_val == 2)
                    {
                        victory ++;
                        $('.display_player2').html('Joueur 2 : ' + victory);
                    }
                }
                j--;
            }
        }
    }
    if(p1token == p2token)
    {
        $('body').html("<h1>Les deux joueurs ont la même couleur. Veuillez en choisir une autre et rafraîchir la page s'il vous plait.");
    }
    else
    {
        var instance = new GameBoard();
        instance.display_grid(col_nbr, row_nbr);
        var inst = new play();
        var gameover = 0;
        $(document).on('click', '.neutral' , function()
        {
            var self = $(this);
            var activ_cel = inst.insert_tokens(self);
            inst.horizontal_check(activ_cel);
            inst.vertical_check(activ_cel);
            inst.diag1_check(activ_cel);
            inst.diag2_check(activ_cel);
            gameover ++;
            if(gameover >= col_nbr * row_nbr)
            {
                alert('Match nul, veuillez recommencer une partie.');
            }
        });
    }
}
$('body').P4(6,6, "red", "yellow");