from django.shortcuts import render
from django.core.mail import send_mail, EmailMessage
from django.conf import settings
from django.contrib import messages
from django.template.loader import render_to_string
from .forms import ContatoForm

def index(request):
    form = ContatoForm()
    
    if request.method == 'POST':
        form = ContatoForm(request.POST)
        if form.is_valid():
            # Dados do formulário
            nome = form.cleaned_data['nome']
            empresa = form.cleaned_data.get('empresa', 'Não informada')
            email = form.cleaned_data['email']
            whatsapp = form.cleaned_data.get('whatsapp', 'Não informado')
            mensagem = form.cleaned_data['mensagem']
            
            # Preparar contexto para o template do e-mail
            context = {
                'nome': nome,
                'empresa': empresa,
                'email': email,
                'whatsapp': whatsapp,
                'mensagem': mensagem,
            }
            
            # Renderizar template HTML do e-mail
            html_message = render_to_string('email/contato.html', context)
            
            # Texto plano como fallback
            plain_message = f"""
            Nome: {nome}
            Empresa: {empresa}
            E-mail: {email}
            WhatsApp: {whatsapp}
            
            Mensagem:
            {mensagem}
            """
            
            assunto = f'Novo orçamento - LS Tech - {nome}'
            
            try:
                # Enviar e-mail com HTML
                email_msg = EmailMessage(
                    assunto,
                    html_message,
                    settings.DEFAULT_FROM_EMAIL or 'contato@lstech.dev',
                    ['lstechsolution1@gmail.com'],
                )
                email_msg.content_subtype = 'html'  # Define como HTML
                email_msg.send(fail_silently=False)
                
                messages.success(request, 'Mensagem enviada com sucesso! Entraremos em contato em breve.')
                form = ContatoForm()  # reseta o formulário
            except Exception as e:
                messages.error(request, f'Erro ao enviar mensagem: {e}')
    
    return render(request, 'core/index.html', {'form': form})