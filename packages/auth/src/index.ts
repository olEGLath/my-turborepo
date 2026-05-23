import { 
  AbilityBuilder, 
  CreateAbility, 
  createMongoAbility, 
  MongoAbility
} from '@casl/ability'

export type Role = 'ADMIN' | 'MEMBER' | 'BILLING'
export type AppActions = 'manage' | 'create' | 'read' | 'update' | 'delete'

// 1. Modelos com a propriedade de identificação para o CASL (__typename)
export interface User {
  id: string
  role: Role
}

export interface Project {
  __typename: 'Project'
  id: string
  organizationId: string
}

export interface Organization {
  __typename: 'Organization'
  id: string
  ownerId: string
}

// 2. Tipagem das Subjects aceitando strings ou os modelos tipados
export type AppSubjects = 
  | 'all'
  | 'User'
  | 'Project'
  | 'Organization'
  | Project
  | Organization
  | User

export type AppAbility = MongoAbility<[AppActions, AppSubjects]>
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>

// Tipo auxiliar para extrair as permissões limpas
type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void

// 3. Definindo as permissões do App com Condicionais de verdade!
export const roles: Record<Role, PermissionsByRole> = {
  ADMIN: (_, { can }) => {
    can('manage', 'all')
  },
  MEMBER: (user, { can }) => {
    // Membro pode ler projetos em geral
    can('read', 'Project')
    
    // Condicional: Só pode dar update ou delete se o projeto pertencer à organização dele
    // Nota: O CASL vai checar se a propriedade 'organizationId' do objeto é igual ao id do contexto (que vamos passar)
    can(['update', 'delete'], 'Project', {
      organizationId: { $eq: user.id } // Aqui simulamos a checagem, no app real passamos o orgId ativo
    })
  },
  BILLING: (_, { can }) => {
    can('read', 'Organization')
  },
}

// 4. Função principal atualizada passando o 'user' para as roles usarem nas condicionais
export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder<AppAbility>(createAppAbility)

  if (typeof roles[user.role] === 'function') {
    roles[user.role](user, builder)
  } else {
    throw new Error(`Permissions for role ${user.role} were not defined.`)
  }

  const { build } = builder

  // Ensinamos o CASL a descobrir o tipo do objeto checando a propriedade '__typename'
  return build({
    detectSubjectType: (subject) => {
      if (subject && typeof subject === 'object' && '__typename' in subject) {
        return subject.__typename
      }
      return subject as any
    }
  })
}