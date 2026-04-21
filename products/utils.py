import os
from django.conf import settings
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
from datetime import datetime
import math
from collections import Counter
import re

BLACK      = colors.HexColor('#1a1a1a')
DARK_GRAY  = colors.HexColor('#444444')
MID_GRAY   = colors.HexColor('#888888')
LIGHT_GRAY = colors.HexColor('#e8e8e8')
WHITE      = colors.white
ACCENT     = colors.HexColor('#2c3e50')

def generate_product_pdf(product):
    font = "Helvetica"
    font_bold = "Helvetica-Bold"

    buffer = BytesIO()
    margin = 50

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=margin,
        leftMargin=margin,
        topMargin=margin,
        bottomMargin=margin,
        title=f'BeautyShop - {product.name}',
        author='BeautyShop',
        subject=f'Product details for {product.name}',
    )

    content_width = A4[0] - 2 * margin
    story = []
    styles = getSampleStyleSheet()

    def style(name, **kw):
        kw.setdefault('fontName', font)
        return ParagraphStyle(name, parent=styles['Normal'], **kw)

    s_brand = style('Brand',
        fontSize=10, leading=14, textColor=MID_GRAY, spaceAfter=2)

    s_title = style('Title',
        fontSize=20, leading=26, spaceAfter=4,
        textColor=BLACK, fontName=font_bold)

    s_category = style('Category',
        fontSize=10, leading=14, spaceAfter=0,
        textColor=MID_GRAY)

    s_section = style('Section',
        fontSize=11, leading=15, spaceBefore=16, spaceAfter=6,
        textColor=ACCENT, fontName=font_bold)

    s_body = style('Body',
        fontSize=10, leading=16, spaceAfter=2, textColor=DARK_GRAY)

    s_label = style('Label',
        fontSize=9, leading=13, spaceAfter=1,
        textColor=MID_GRAY, fontName=font_bold)

    s_value = style('Value',
        fontSize=10, leading=15, textColor=BLACK)

    s_price = style('PriceAmt',
        fontSize=22, leading=28, textColor=BLACK,
        fontName=font_bold, alignment=TA_LEFT)

    s_footer = style('Footer',
        fontSize=8, leading=12, textColor=MID_GRAY, alignment=TA_CENTER)

    story.append(Paragraph('BeautyShop', s_brand))
    story.append(Paragraph(product.name, s_title))

    category_name = product.category.name if product.category else 'N/A'
    story.append(Paragraph(f'Category: {category_name}', s_category))

    story.append(Spacer(1, 10))
    story.append(HRFlowable(width=content_width, thickness=1,
                             color=BLACK, spaceAfter=16, spaceBefore=0))

    if product.image:
        try:
            image_path = os.path.join(settings.MEDIA_ROOT, product.image.name)
            if os.path.exists(image_path):
                img = Image(image_path, width=2.5 * inch, height=2.5 * inch)
                img.hAlign = 'LEFT'
                story.append(img)
                story.append(Spacer(1, 14))
        except Exception:
            pass

    story.append(Paragraph('Description', s_section))
    story.append(HRFlowable(width=content_width, thickness=0.5,
                             color=LIGHT_GRAY, spaceAfter=8))
    desc_text = (product.description or 'No description available.').replace('\n', '<br/>')
    story.append(Paragraph(desc_text, s_body))

    story.append(Paragraph('Specifications', s_section))
    story.append(HRFlowable(width=content_width, thickness=0.5,
                             color=LIGHT_GRAY, spaceAfter=8))

    if product.stock > 0:
        availability = f'In stock ({product.stock} units)'
    else:
        availability = 'Out of stock'

    supplier_val   = product.supplier or '—'
    delivery_val   = product.delivery_method or '—'

    col = content_width / 2

    def spec_row(label, value):
        return [
            Paragraph(label, s_label),
            Paragraph(str(value), s_value),
        ]

    spec_data = [
        spec_row('CATEGORY',         category_name),
        spec_row('AVAILABILITY',     availability),
        spec_row('SUPPLIER',         supplier_val),
        spec_row('DELIVERY METHOD',  delivery_val),
    ]

    spec_table = Table(spec_data, colWidths=[col * 0.45, col * 1.55])
    spec_table.setStyle(TableStyle([
        ('FONTNAME',      (0, 0), (-1, -1), font),
        ('VALIGN',        (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING',    (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING',   (0, 0), (-1, -1), 0),
        ('RIGHTPADDING',  (0, 0), (-1, -1), 8),
        ('LINEBELOW',     (0, 0), (-1, -2), 0.3, LIGHT_GRAY),
    ]))
    story.append(spec_table)

    if product.specifications:
        story.append(Spacer(1, 10))
        story.append(Paragraph('TECHNICAL SPECIFICATIONS', s_label))
        specs_clean = product.specifications.replace('\n', '<br/>')
        story.append(Paragraph(specs_clean, s_body))

    story.append(Spacer(1, 20))
    story.append(HRFlowable(width=content_width, thickness=1,
                             color=LIGHT_GRAY, spaceAfter=12))
    story.append(Paragraph('Price', s_section))
    story.append(Paragraph(f'{product.price} RON', s_price))

    story.append(Spacer(1, 24))
    story.append(HRFlowable(width=content_width, thickness=0.5,
                             color=LIGHT_GRAY, spaceAfter=8))
    generated_at = datetime.now().strftime('%d %B %Y, %H:%M')
    story.append(Paragraph(
        f'BeautyShop  ·  Generated: {generated_at}',
        s_footer
    ))

    doc.build(story)

    pdf_bytes = buffer.getvalue()
    buffer.close()

    import re
    safe_name = re.sub(r'[^\w\s-]', '', product.name).strip()
    safe_name = re.sub(r'[\s]+', '_', safe_name)
    filename = f'{safe_name}_{product.id}.pdf'

    os.makedirs(os.path.join(settings.MEDIA_ROOT, 'product_pdfs'), exist_ok=True)
    file_path = os.path.join(settings.MEDIA_ROOT, 'product_pdfs', filename)
    with open(file_path, 'wb') as f:
        f.write(pdf_bytes)

    return f'product_pdfs/{filename}'

def normalize_text(text):
    if not text:
        return ""
    return re.sub(r"\s+", " ", re.sub(r"[^\w\s]", " ", text.lower())).strip()

def tokenize(text):
    normalized = normalize_text(text)
    if not normalized:
        return []
    return normalized.split()

def build_vocabulary(documents):
    vocab = set()
    for doc in documents:
        vocab.update(doc)
    return list(vocab)

def compute_tf(document):
    tf = Counter(document)
    total = len(document)
    return {word: count / total for word, count in tf.items()}

def compute_idf(documents, vocab):
    N = len(documents)
    idf = {}
    for word in vocab:
        containing = sum(1 for doc in documents if word in doc)
        idf[word] = math.log((N + 1) / (containing + 1)) + 1
    return idf

def vectorize(document, vocab, idf):
    tf = compute_tf(document)
    vector = []
    for word in vocab:
        tf_val = tf.get(word, 0)
        vector.append(tf_val * idf[word])
    return vector

def cosine_similarity(vec1, vec2):

    dot = sum(a * b for a, b in zip(vec1, vec2))
    norm1 = math.sqrt(sum(a * a for a in vec1))
    norm2 = math.sqrt(sum(b * b for b in vec2))

    if norm1 == 0 or norm2 == 0:
        return 0
    return dot / (norm1 * norm2)

def build_character_trigrams(text):
    normalized = f"  {normalize_text(text)}  "
    if len(normalized.strip()) < 3:
        return {normalized.strip()} if normalized.strip() else set()
    return {normalized[index:index + 3] for index in range(len(normalized) - 2)}


def trigram_similarity(left, right):
    left_grams = build_character_trigrams(left)
    right_grams = build_character_trigrams(right)

    if not left_grams or not right_grams:
        return 0.0

    common = len(left_grams & right_grams)
    return (2 * common) / (len(left_grams) + len(right_grams))

def levenshtein_distance(left, right):
    left = normalize_text(left)
    right = normalize_text(right)

    if left == right:
        return 0
    if not left:
        return len(right)
    if not right:
        return len(left)

    previous_row = list(range(len(right) + 1))

    for left_index, left_char in enumerate(left, start=1):
        current_row = [left_index]
        for right_index, right_char in enumerate(right, start=1):
            insertions = previous_row[right_index] + 1
            deletions = current_row[right_index - 1] + 1
            substitutions = previous_row[right_index - 1] + (left_char != right_char)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]


def autocomplete_products(query, products, limit=8):
    normalized_query = normalize_text(query)
    if not normalized_query:
        return []

    suggestions = []
    for product in products:
        normalized_name = normalize_text(product.name)
        if not normalized_name:
            continue

        starts_with = normalized_name.startswith(normalized_query)
        contains_token_prefix = any(
            token.startswith(normalized_query) for token in normalized_name.split()
        )
        trigram_score = trigram_similarity(normalized_query, normalized_name)
        edit_distance = levenshtein_distance(normalized_query, normalized_name)
        max_len = max(len(normalized_query), len(normalized_name), 1)
        edit_score = 1 - (edit_distance / max_len)

        final_score = (
            (1.0 if starts_with else 0.0) * 4
            + (1.0 if contains_token_prefix else 0.0) * 2
            + trigram_score * 2
            + max(edit_score, 0)
        )

        if starts_with or contains_token_prefix or trigram_score >= 0.18 or edit_distance <= 3:
            suggestions.append(
                {
                    "id": product.id,
                    "name": product.name,
                    "category_name": product.category.name if product.category else "",
                    "score": round(final_score, 4),
                }
            )

    suggestions.sort(key=lambda item: (-item["score"], len(item["name"]), item["name"].lower()))
    return suggestions[:limit]


def build_product_document(product):
    category_name = product.category.name if product.category else ""
    return " ".join(
        filter(
            None,
            [
                product.name,
                category_name,
                product.description,
                product.specifications,
            ],
        )
    )


def prefix_match(query_terms, document_words):
    matched = []
    for term in query_terms:
        for word in document_words:
            if word.startswith(term):
                matched.append(word)
    return matched

def search_products_tfidf(query, products):

    query_terms = tokenize(query)

    documents = [
        tokenize(build_product_document(p))
        for p in products
    ]

    vocab = build_vocabulary(documents)

    idf = compute_idf(documents, vocab)

    query_expanded = []

    for doc in documents:
        query_expanded += prefix_match(query_terms, doc)

    if not query_expanded:
        query_expanded = query_terms

    query_vector = vectorize(query_expanded, vocab, idf)

    results = []

    for product, doc_words in zip(products, documents):

        doc_vector = vectorize(doc_words, vocab, idf)

        score = cosine_similarity(query_vector, doc_vector)

        if score > 0:
            results.append((product, score))

    results.sort(key=lambda x: x[1], reverse= True)

    return [product for product, score in results]


def recommend_similar_products(product, products, limit=4):
    candidates = [candidate for candidate in products if candidate.id != product.id]
    if not candidates:
        return []

    base_document = tokenize(build_product_document(product))
    candidate_documents = [tokenize(build_product_document(candidate)) for candidate in candidates]
    documents = [base_document, *candidate_documents]

    vocab = build_vocabulary(documents)
    idf = compute_idf(documents, vocab)
    base_vector = vectorize(base_document, vocab, idf)

    results = []
    for candidate, candidate_document in zip(candidates, candidate_documents):
        candidate_vector = vectorize(candidate_document, vocab, idf)
        score = cosine_similarity(base_vector, candidate_vector)
        if score <= 0:
            continue

        candidate.similarity_score = round(score, 4)
        results.append(candidate)

    results.sort(key=lambda candidate: getattr(candidate, "similarity_score", 0), reverse=True)
    return results[:limit]