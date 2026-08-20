from django import forms

class ContatoForm(forms.Form):
    nome = forms.CharField(max_length=100, label='Nome completo')
    empresa = forms.CharField(max_length=100, required=False, label='Empresa')
    email = forms.EmailField(label='E-mail')
    whatsapp = forms.CharField(max_length=20, required=False, label='WhatsApp')
    mensagem = forms.CharField(widget=forms.Textarea, label='Conte um pouco sobre seu projeto')