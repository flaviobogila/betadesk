
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.TenantScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logoUrl: 'logoUrl',
  plan: 'plan',
  isActive: 'isActive',
  createdAt: 'createdAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  name: 'name',
  email: 'email',
  role: 'role',
  isActive: 'isActive',
  isVerified: 'isVerified',
  createdAt: 'createdAt'
};

exports.Prisma.TeamScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  name: 'name',
  createdAt: 'createdAt'
};

exports.Prisma.TeamMemberScalarFieldEnum = {
  userId: 'userId',
  teamId: 'teamId',
  role: 'role',
  createdAt: 'createdAt'
};

exports.Prisma.ContactScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  name: 'name',
  phone: 'phone',
  email: 'email',
  origin: 'origin',
  stage: 'stage',
  createdById: 'createdById',
  createdAt: 'createdAt'
};

exports.Prisma.ChannelScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  name: 'name',
  type: 'type',
  provider: 'provider',
  externalId: 'externalId',
  token: 'token',
  isActive: 'isActive',
  createdAt: 'createdAt',
  metadata: 'metadata'
};

exports.Prisma.ConversationScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  contactId: 'contactId',
  channelId: 'channelId',
  provider: 'provider',
  externalId: 'externalId',
  externalChannelId: 'externalChannelId',
  status: 'status',
  assignedUserId: 'assignedUserId',
  teamId: 'teamId',
  lastMessageAt: 'lastMessageAt',
  createdAt: 'createdAt'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  conversationId: 'conversationId',
  senderType: 'senderType',
  senderId: 'senderId',
  senderName: 'senderName',
  messageType: 'messageType',
  content: 'content',
  mediaUrl: 'mediaUrl',
  mediaCaption: 'mediaCaption',
  mediaMimeType: 'mediaMimeType',
  mediaSize: 'mediaSize',
  mediaDuration: 'mediaDuration',
  componentHeader: 'componentHeader',
  componentFooter: 'componentFooter',
  componentButtons: 'componentButtons',
  metadata: 'metadata',
  reaction: 'reaction',
  isPrivate: 'isPrivate',
  status: 'status',
  externalId: 'externalId',
  createdAt: 'createdAt',
  receivedAt: 'receivedAt'
};

exports.Prisma.LabelScalarFieldEnum = {
  id: 'id',
  tenantId: 'tenantId',
  name: 'name',
  color: 'color',
  createdById: 'createdById',
  createdAt: 'createdAt'
};

exports.Prisma.ConversationLabelScalarFieldEnum = {
  conversationId: 'conversationId',
  labelId: 'labelId',
  createdAt: 'createdAt'
};

exports.Prisma.MentionScalarFieldEnum = {
  id: 'id',
  messageId: 'messageId',
  mentionedId: 'mentionedId',
  createdAt: 'createdAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  admin: 'admin',
  manager: 'manager',
  agent: 'agent'
};

exports.TeamRole = exports.$Enums.TeamRole = {
  admin: 'admin',
  member: 'member'
};

exports.ChannelType = exports.$Enums.ChannelType = {
  whatsapp: 'whatsapp',
  instagram: 'instagram',
  facebook: 'facebook',
  telegram: 'telegram'
};

exports.ConversationStatus = exports.$Enums.ConversationStatus = {
  open: 'open',
  in_queue: 'in_queue',
  closed: 'closed',
  bot: 'bot'
};

exports.SenderType = exports.$Enums.SenderType = {
  user: 'user',
  bot: 'bot',
  system: 'system',
  agent: 'agent'
};

exports.MessageType = exports.$Enums.MessageType = {
  text: 'text',
  image: 'image',
  video: 'video',
  audio: 'audio',
  document: 'document',
  sticker: 'sticker',
  location: 'location',
  contact: 'contact',
  button: 'button',
  template: 'template',
  component: 'component'
};

exports.MessageStatus = exports.$Enums.MessageStatus = {
  pending: 'pending',
  sent: 'sent',
  failed: 'failed',
  delivered: 'delivered',
  read: 'read'
};

exports.Prisma.ModelName = {
  Tenant: 'Tenant',
  User: 'User',
  Team: 'Team',
  TeamMember: 'TeamMember',
  Contact: 'Contact',
  Channel: 'Channel',
  Conversation: 'Conversation',
  Message: 'Message',
  Label: 'Label',
  ConversationLabel: 'ConversationLabel',
  Mention: 'Mention'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
