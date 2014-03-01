var colorSpace = '#111111'

l.game.setup(colorSpace, true)
l.keyboard.enable()

l.debug.all = false

l.physics.friction(2)

l.object.make('earth', l.canvas.width / 2, l.canvas.height / 2, 125, 125)
	l.object.sprite('earth', 'images/earth.png')
	l.object.anchor('earth', 125 / 2, 125 / 2)
	l.object.categorize('earth', 'planets')

l.object.make('earth2', 150, 150, 125, 125)
	l.object.sprite('earth2', 'images/earth.png')
	l.object.anchor('earth2', 125 / 2, 125 / 2)
	l.object.categorize('earth2', 'planets')

l.object.make('moon', l.canvas.width, l.canvas.height, 85, 85)
	l.object.sprite('moon', 'images/moon.png')
	l.object.anchor('moon', 85 / 2, 85 / 2)

l.game.start()

function game()
{
	if (l.game.state == 'loading')
	{
		l.draw.blank(colorSpace)
		l.text.write(l.preloader.percent + '% loaded', 10, l.entities.camera.height - 10, '#ffffff')
	}
	else if (l.game.state == 'menu')
	{
		l.game.state = 'running'
	}
	else if (l.game.state == 'running')
	{
		if (l.keyboard.up)
		{
			l.physics.push.up('earth', 10)
		}
		else if (l.keyboard.down)
		{
			l.physics.push.down('earth', 10)
		}

		if (l.keyboard.left)
		{
			l.physics.push.left('earth', 10)
		}
		else if (l.keyboard.right)
		{
			l.physics.push.right('earth', 10)
		}

		l.physics.update('planets')
		l.physics.update('moon')
		l.physics.bounce('earth', 0, l.canvas.width, 0, l.canvas.height)
		l.physics.pull.toward('moon', 'earth', 25)

		l.entities.camera.color = colorSpace
		l.collision('moon', 'planets', 'l.entities.camera.color = "#ff0000"')
		l.collision('moon', 'earth2', 'l.object.delete(b)')

		/*
		if (l.collision.overlap('earth', 'moon'))
		{
			if (l.entities.moon.physics.momentum.total > l.entities.earth.physics.momentum.total)
			{
				l.physics.momentum.transfer('moon', 'earth')
				l.physics.momentum.stop('moon')
			}
			else
			{
				l.physics.momentum.transfer('earth', 'moon')
				l.physics.momentum.stop('earth')
			}
		}
		*/

		l.draw.blank()
		l.draw.object('planets')
		l.draw.object('moon')
	}
}