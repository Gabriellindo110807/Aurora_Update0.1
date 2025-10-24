# Configuração do Login com Google no Aurora

## 📋 Pré-requisitos

Para habilitar o login com Google no projeto Aurora, você precisa configurar as credenciais OAuth no Google Cloud Console e no Lovable Cloud.

---

## 🔧 Passo 1: Criar Projeto no Google Cloud Console

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Navegue até **APIs & Services** > **Credentials**

---

## 🔑 Passo 2: Configurar Tela de Consentimento OAuth

1. No menu lateral, clique em **OAuth consent screen**
2. Selecione **External** (para apps públicos) e clique em **CREATE**
3. Preencha as informações obrigatórias:
   - **App name**: Aurora Technology
   - **User support email**: seu email
   - **Developer contact information**: seu email
4. Em **Authorized domains**, adicione:
   - `lovable.app`
   - Seu domínio customizado (se tiver)
5. Configure os escopos necessários:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
6. Clique em **SAVE AND CONTINUE**

---

## 🎫 Passo 3: Criar Credenciais OAuth 2.0

1. Vá para **Credentials** > **CREATE CREDENTIALS** > **OAuth client ID**
2. Selecione **Web application**
3. Configure as URLs:

### Authorized JavaScript origins:
```
https://lovable.app
http://localhost:5173
```

### Authorized redirect URIs:
```
https://[SEU_PROJECT_ID].supabase.co/auth/v1/callback
https://lovable.app/auth/callback
http://localhost:5173/auth/callback
```

4. Clique em **CREATE**
5. Copie o **Client ID** e **Client Secret** gerados

---

## ⚙️ Passo 4: Configurar no Lovable Cloud

1. Acesse o dashboard do Lovable Cloud
2. Navegue até **Users** > **Auth Settings**
3. Role até a seção **Google Settings**
4. Cole as credenciais obtidas:
   - **Google Client ID**
   - **Google Client Secret**
5. Ative o Google OAuth
6. Salve as configurações

---

## 🎯 Passo 5: Configurar Site URL e Redirect URLs

No Lovable Cloud, em **Auth Settings**:

1. **Site URL**: Defina como a URL principal do seu app
   ```
   https://lovable.app
   ```

2. **Redirect URLs**: Adicione todas as URLs de callback possíveis
   ```
   https://lovable.app/**
   http://localhost:5173/**
   ```

---

## ✅ Testando a Implementação

1. Acesse a página de login do Aurora: `/auth`
2. Clique no botão **"Continuar com Google"**
3. Você será redirecionado para a tela de consentimento do Google
4. Após autorizar, será redirecionado de volta para o app autenticado

---

## 🔍 Troubleshooting

### Erro: "redirect_uri_mismatch"
**Solução**: Verifique se todas as URLs de redirect estão cadastradas no Google Cloud Console E no Lovable Cloud

### Erro: "invalid_client"
**Solução**: Confirme que o Client ID e Client Secret estão corretos no Lovable Cloud

### Erro: "Access blocked: This app's request is invalid"
**Solução**: Configure a tela de consentimento OAuth corretamente e adicione os domínios autorizados

### Login funciona localmente mas não em produção
**Solução**: Adicione o domínio de produção nas Authorized JavaScript origins e Redirect URIs no Google Cloud Console

---

## 🏗️ Arquitetura Implementada

O projeto Aurora utiliza o **Strategy Pattern** para gerenciar diferentes métodos de autenticação:

- **EmailPasswordStrategy**: Login com email/senha
- **GoogleAuthStrategy**: Login com Google OAuth
- **AuthContext**: Gerenciador que permite trocar entre estratégias

Arquivo principal: `src/strategies/AuthStrategy.ts`

---

## 📚 Referências

- [Documentação Supabase - Google OAuth](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Lovable Cloud Dashboard](#)

---

**© 2025 Aurora Technology**
