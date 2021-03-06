import MilkClient from '../client'
import PatchedModule from '../PatchedModule'
import { command, optional } from '@pikostudio/command.ts'
import { Message, MessageEmbed, User } from 'discord.js'
import moment from 'moment'
import { formatDuration } from '../utils'
import { cpus } from 'os'
import * as os from 'os'

enum Status {
  online = 'μ¨λΌμΈ [π’]',
  dnd = 'λ€λ₯Έ μ©λ¬΄ μ€ [β]',
  idle = 'μλ¦¬ λΉμ [π]',
  offline = 'μ€νλΌμΈ [π]',
}

enum Client {
  mobile = '`λͺ¨λ°μΌ` <:mobile:817673574658998332>',
  web = '`μΉ` π',
  desktop = '`μ»΄ν¨ν°` π₯οΈ',
}

class Info extends PatchedModule {
  constructor(public client: MilkClient) {
    super(__filename)
  }

  @command({ name: 'νλ‘ν' })
  async profileImage(msg: Message, @optional user: User = msg.author) {
    return msg.reply(
      new MessageEmbed({
        color: 'RANDOM',
        title: `${user.tag}λμ νλ‘ν`,
      }).setImage(user.displayAvatarURL({ size: 4096, dynamic: true })),
    )
  }

  @command({ name: 'μ μ μ λ³΄', aliases: ['userinfo'] })
  async userInfo(msg: Message, @optional user: User = msg.author) {
    return msg.reply(
      new MessageEmbed()
        .setTitle(`${user.tag}λμ μ λ³΄`)
        .setThumbnail(
          msg.author.displayAvatarURL({ size: 4096, dynamic: true }),
        )
        .addFields([
          {
            name: 'ID',
            value: '`' + user.id + '`',
          },
          {
            name: 'νκ·Έ',
            value: '`' + user.tag + '`',
          },
          {
            name: 'μν',
            value:
              '`' +
              Status[
                user.presence.status === 'invisible'
                  ? 'offline'
                  : user.presence.status
              ] +
              '`',
          },
          {
            name: 'μ μ ν΄λΌμ΄μΈνΈ',
            value: user.presence.clientStatus
              ? Object.keys(user.presence.clientStatus)
                  .map((k) => Client[k as 'mobile' | 'web' | 'desktop'])
                  .join(', ')
              : '`μμ`',
          },
          {
            name: 'κ³μ  μμ±μΌ',
            value: moment(user.createdAt).format(
              'YYYY/MM/DD A hh : mm : ss (Z)',
            ),
          },
        ]),
    )
  }

  @command({ name: 'μλ²μ λ³΄', aliases: ['serverinfo'] })
  async serverInfo(msg: Message) {
    if (!msg.guild) return msg.reply('μλ²μμλ§ μ¬μ© κ°λ₯ν©λλ€.')
    const guild = msg.guild
    await msg.reply(
      new MessageEmbed({
        color: 'RANDOM',
      })
        .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 })!)
        .setTitle(`μλ² ${guild.name}μ μ λ³΄`)
        .addFields([
          {
            name: 'μλ² μμ μ',
            value: '`' + guild.owner!.user.tag + '`',
          },
          {
            name: 'μλ² ID',
            value: '`' + guild.id + '`',
          },
          {
            name: 'μ μ  μ',
            value:
              '`μ μ²΄: ' +
              guild.memberCount +
              '`\n`μ μ : ' +
              guild.members.cache.filter((x) => !x.user.bot).size +
              '`\n`λ΄: ' +
              guild.members.cache.filter((x) => x.user.bot).size +
              '`',
          },
          {
            name: 'μλ² μ§μ­',
            value: guild.region,
          },
          {
            name: 'μλ² μμ±μΌ',
            value:
              '`' +
              moment(guild.createdAt).format(
                'YYYYλ MMμ DDμΌ A hhμ mmλΆ ssμ΄ (Z)',
              ) +
              '(' +
              moment(guild.createdAt).fromNow() +
              ')' +
              '`',
          },
        ]),
    )
    if (guild.splash)
      await msg.channel.send(
        new MessageEmbed({
          title: `μλ² ${guild.name}μ μ΄λ λ°°κ²½`,
        })
          .setColor('RANDOM')
          .setImage(
            guild.splashURL({
              size: 4096,
            })!,
          ),
      )
    if (guild.banner)
      await msg.channel.send(
        new MessageEmbed({
          title: `μλ² ${guild.name}μ λ°°λ`,
        })
          .setColor('RANDOM')
          .setImage(
            guild.bannerURL({
              size: 4096,
            })!,
          ),
      )
  }

  @command({ name: 'λ΄μ λ³΄', aliases: ['botinfo', 'hellothisisverification'] })
  async borInfo(msg: Message) {
    const u = this.client.user!
    return msg.reply(
      new MessageEmbed()
        .setTitle(`${u.tag} λ΄ μ λ³΄`)
        .setColor('RANDOM')
        .setTimestamp(Date.now())
        .setFooter(
          msg.author.tag,
          msg.author.displayAvatarURL({ dynamic: true, size: 512 }),
        )
        .setThumbnail(
          u.displayAvatarURL({
            size: 4096,
          }),
        )
        .addFields([
          {
            name: 'κ°λ°μ',
            value: this.client.owners
              .map((x) => this.client.users.cache.get(x)?.tag)
              .filter((x) => x)
              .map((x) => '`' + x + '`')
              .join(', '),
          },
          {
            name: 'λ΄ ID',
            value: '`' + u.id + '`',
          },
          {
            name: 'λ΄ μμΌ',
            value: `\`${moment(u.createdAt).format(
              'YYYYλ MMμ DDμΌ A hhμ mmλΆ ssμ΄ (Z)',
            )}\``,
          },
          {
            name: 'μ¬μ©μ',
            value: [
              `μ μ μ: ${this.client.users.cache.size}`,
              `μλ²μ: ${this.client.guilds.cache.size}`,
            ]
              .map((x) => '`' + x + '`')
              .join('\n'),
          },
          {
            name: 'μνμ',
            value: formatDuration(Date.now() - this.client.readyTimestamp!),
          },
          {
            name: 'CPU',
            value: Array.from(
              new Set(os.cpus().map((x) => '`' + x.model + '`')),
            ).join(', '),
          },
          {
            name: 'OS',
            value: `\`${os.type()} ${os.arch()}\``,
          },
          {
            name: 'μ΄λλ§ν¬',
            value: `[\`κ΄λ¦¬μ κΆνμΌλ‘ μ΄λνκΈ°\`](https://discord.com/api/oauth2/authorize?client_id=${u.id}&permissions=8&scope=bot)\n[\`μΆμ² κΆνμΌλ‘ μ΄λνκΈ°\`](https://discord.com/api/oauth2/authorize?client_id=${u.id}&permissions=3224696839&scope=bot)\n[\`Milk Support\`](https://discord.gg/NGKMhBeMzz)`,
          },
        ]),
    )
  }
}

export function install(client: MilkClient) {
  return new Info(client)
}
