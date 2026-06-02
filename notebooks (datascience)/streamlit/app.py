import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os
from PIL import Image

# ============================================================
# CONFIG
# ============================================================
st.set_page_config(
    page_title="Eksplorasi Data NutriVision",
    layout="wide"
)

# ============================================================
# STYLE
# ============================================================
st.markdown("""
<style>
    .main { background-color: #f9f9f7; }
    .block-container { padding-top: 2rem; padding-bottom: 2rem; }
    h1, h2, h3 { color: #1a1a18; }
    .metric-card {
        background: white;
        border-radius: 12px;
        padding: 1.2rem 1rem;
        box-shadow: 0 1px 4px rgba(0,0,0,0.07);
        text-align: center;
        border-top: 3px solid #1D9E75;
    }
    .metric-label {
        font-size: 12px;
        color: #888780;
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    .metric-value {
        font-size: 26px;
        font-weight: 700;
        color: #1D9E75;
    }
    .section-title {
        font-size: 18px;
        font-weight: 700;
        color: #1a1a18;
        margin-bottom: 0.2rem;
    }
    .section-sub {
        font-size: 13px;
        color: #888780;
        margin-bottom: 1.2rem;
    }
    .divider {
        border: none;
        border-top: 1px solid #e5e5e0;
        margin: 2.5rem 0;
    }
    .insight-box {
        background: #f0faf6;
        border-left: 4px solid #1D9E75;
        border-radius: 6px;
        padding: 0.8rem 1rem;
        font-size: 13px;
        color: #2C2C2A;
        margin-top: 0.8rem;
    }
    .image-label {
        font-size: 12px;
        color: #888780;
        text-align: center;
        margin-top: 4px;
    }
    .label-badge {
        display: inline-block;
        background: #1D9E75;
        color: white;
        border-radius: 20px;
        padding: 2px 12px;
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 1rem;
    }
    .sidebar-stat {
        background: white;
        border-radius: 10px;
        padding: 0.8rem 1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        text-align: center;
        border-top: 3px solid #1D9E75;
        margin-bottom: 8px;
    }
</style>
""", unsafe_allow_html=True)

# ============================================================
# LOAD DATA
# ============================================================
@st.cache_data
def load_data():
    summary   = pd.read_csv('notebooks (datascience)/streamlit/data/summary_stats.csv').iloc[0]
    per_label = pd.read_csv('notebooks (datascience)/streamlit/data/per_label.csv')
    dist      = pd.read_csv('notebooks (datascience)/streamlit/data/distributions.csv')
    return summary, per_label, dist

summary, per_label, dist = load_data()

TEAL   = '#1D9E75'
TEAL2  = '#2BAF84'
ORANGE = '#E07B54'
BLUE   = '#3A6DB5'

def style_ax(ax):
    ax.set_facecolor('white')
    for spine in ax.spines.values():
        spine.set_visible(False)
    ax.yaxis.grid(True, color='#e0e0e0', linewidth=0.8, zorder=0)
    ax.set_axisbelow(True)
    ax.tick_params(colors='#888780', labelsize=9, length=0)

def fig_to_st(fig):
    st.pyplot(fig)
    plt.close(fig)

def insight(text):
    st.markdown(f'<div class="insight-box">{text}</div>', unsafe_allow_html=True)

# ============================================================
# SIDEBAR
# ============================================================
all_labels = sorted(per_label['label'].tolist())

with st.sidebar:
    st.markdown("""
    <div style="font-size:20px; font-weight:800; color:#1a1a18; margin-bottom:4px;">
        NutriVision
    </div>
    <div style="font-size:12px; color:#888780; margin-bottom:1.5rem;">
        Data Exploration Dashboard
    </div>
    """, unsafe_allow_html=True)

    st.markdown("**Filter by Label**")
    selected_label = st.selectbox(
        "label",
        options=['All Labels'] + all_labels,
        label_visibility='collapsed'
    )

    st.markdown('<hr style="border-top:1px solid #e5e5e0; margin:1rem 0;">', unsafe_allow_html=True)

    if selected_label != 'All Labels':
        row = per_label[per_label['label'] == selected_label].iloc[0]

        st.markdown('<div style="font-size:11px; color:#888780; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Label Stats</div>', unsafe_allow_html=True)

        for label_txt, val in [
            ("Raw Count",  int(row['raw_count'])),
            ("Before Aug", int(row['before'])),
            ("After Aug",  int(row['after'])),
        ]:
            st.markdown(f"""
            <div class="sidebar-stat">
                <div class="metric-label">{label_txt}</div>
                <div class="metric-value">{val:,}</div>
            </div>""", unsafe_allow_html=True)

        df_b = dist[dist['label'] == selected_label]['brightness'].dropna()
        df_p = dist[dist['label'] == selected_label]['padding_ratio'].dropna()

        if len(df_b) > 0:
            st.markdown('<hr style="border-top:1px solid #e5e5e0; margin:1rem 0;">', unsafe_allow_html=True)
            st.markdown('<div style="font-size:11px; color:#888780; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:8px;">Preprocessing Stats</div>', unsafe_allow_html=True)
            for label_txt, val in [
                ("Avg Brightness",    f"{df_b.mean():.3f}"),
                ("Avg Padding Ratio", f"{df_p.mean()*100:.3f}%"),
            ]:
                st.markdown(f"""
                <div class="sidebar-stat">
                    <div class="metric-label">{label_txt}</div>
                    <div class="metric-value" style="font-size:20px;">{val}</div>
                </div>""", unsafe_allow_html=True)

    st.markdown('<hr style="border-top:1px solid #e5e5e0; margin:1rem 0;">', unsafe_allow_html=True)
    st.markdown('<div style="font-size:11px; color:#aaa; text-align:center;">NutriVision — EDA Dashboard</div>', unsafe_allow_html=True)

# ============================================================
# FILTER DATA
# ============================================================
if selected_label == 'All Labels':
    df_label = per_label
    df_dist  = dist
else:
    df_label = per_label[per_label['label'] == selected_label]
    df_dist  = dist[dist['label'] == selected_label]

# ============================================================
# HEADER
# ============================================================
st.markdown("""
<div style="padding: 1.5rem 0 0.5rem;">
    <div style="font-size:13px; color:#1D9E75; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-bottom:6px;">
        NutriVision — Data Pipeline
    </div>
    <div style="font-size:32px; font-weight:800; color:#1a1a18; margin-bottom:8px;">
        Eksplorasi Data NutriVision
    </div>
    <div style="font-size:14px; color:#888780; max-width:700px;">
        Visualisasi pipeline preprocessing dataset citra makanan — mulai dari gathering, cleaning, augmentasi, hingga preprocessing.
    </div>
</div>
""", unsafe_allow_html=True)

if selected_label != 'All Labels':
    st.markdown(f'<div class="label-badge">Menampilkan: {selected_label}</div>', unsafe_allow_html=True)

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ============================================================
# SECTION 1 — OVERVIEW METRICS
# ============================================================
st.markdown('<div class="section-title">Dataset Overview</div>', unsafe_allow_html=True)
st.markdown('<div class="section-sub">Ringkasan statistik kualitas dataset (37 label raw, 20 label final)</div>', unsafe_allow_html=True)

if selected_label == 'All Labels':
    # Baris 1 — kualitas file
    cols = st.columns(5)
    metrics = [
        ("Total Images (Raw)",     int(summary['total_files'])),
        ("Valid Images",           int(summary['valid_files'])),
        ("Corrupt Images",         int(summary['invalid_files'])),
        ("Small Images (<50px)",   int(summary['small_images'])),
        ("Large Images (>2000px)", int(summary['large_images'])),
    ]
    for col, (lbl, val) in zip(cols, metrics):
        with col:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-label">{lbl}</div>
                <div class="metric-value">{val:,}</div>
            </div>""", unsafe_allow_html=True)

    st.markdown("<br>", unsafe_allow_html=True)

    # Baris 2 — pipeline data
    total_raw      = int(summary['total_files'])
    total_20_label = int(summary['total_before'])
    total_final    = int(summary['total_after'])

    pct_drop = (total_raw - total_20_label) / total_raw * 100 if total_raw > 0 else 0
    pct_aug  = (total_final - total_20_label) / total_20_label * 100 if total_20_label > 0 else 0

    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown(f"""
        <div class="metric-card" style="border-top-color:{ORANGE};">
            <div class="metric-label">Raw Dataset (37 Label)</div>
            <div class="metric-value" style="color:{ORANGE};">{total_raw:,}</div>
            <div style="font-size:11px; color:#aaa; margin-top:4px;">Sebelum proses apapun</div>
        </div>""", unsafe_allow_html=True)
    with col2:
        st.markdown(f"""
        <div class="metric-card" style="border-top-color:{BLUE};">
            <div class="metric-label">Setelah Seleksi Label (20 Label)</div>
            <div class="metric-value" style="color:{BLUE};">{total_20_label:,}</div>
            <div style="font-size:11px; color:#aaa; margin-top:4px;">-{pct_drop:.1f}% dari raw</div>
        </div>""", unsafe_allow_html=True)
    with col3:
        st.markdown(f"""
        <div class="metric-card" style="border-top-color:{TEAL};">
            <div class="metric-label">Setelah Augmentasi & Balancing</div>
            <div class="metric-value" style="color:{TEAL};">{total_final:,}</div>
            <div style="font-size:11px; color:#aaa; margin-top:4px;">+{pct_aug:.1f}% dari setelah seleksi</div>
        </div>""", unsafe_allow_html=True)

else:
    row = per_label[per_label['label'] == selected_label].iloc[0]
    cols = st.columns(3)
    for col, (lbl, val) in zip(cols, [
        ("Raw Count",  int(row['raw_count'])),
        ("Before Aug", int(row['before'])),
        ("After Aug",  int(row['after'])),
    ]):
        with col:
            st.markdown(f"""
            <div class="metric-card">
                <div class="metric-label">{lbl}</div>
                <div class="metric-value">{val:,}</div>
            </div>""", unsafe_allow_html=True)

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ============================================================
# SECTION 2 — DISTRIBUSI PER LABEL
# ============================================================
st.markdown('<div class="section-title">Image Distribution per Label</div>', unsafe_allow_html=True)
st.markdown('<div class="section-sub">Jumlah gambar per label sebelum proses apapun</div>', unsafe_allow_html=True)

if selected_label == 'All Labels':
    df_raw = per_label.sort_values('raw_count', ascending=False)
    fig, ax = plt.subplots(figsize=(14, 5))
    fig.patch.set_facecolor('white')
    x = np.arange(len(df_raw))
    bar_colors = [TEAL if i % 2 == 0 else TEAL2 for i in range(len(df_raw))]
    bars = ax.bar(x, df_raw['raw_count'], color=bar_colors, width=0.6,
                  edgecolor='none', zorder=3)
    for bar, val in zip(bars, df_raw['raw_count']):
        ax.text(bar.get_x() + bar.get_width()/2,
                bar.get_height() + df_raw['raw_count'].max()*0.008,
                f'{val:,}', ha='center', va='bottom', fontsize=7.5, color='#444441')
    ax.set_xticks(x)
    ax.set_xticklabels(df_raw['label'], rotation=40, ha='right', fontsize=9, color='#5F5E5A')
    ax.set_title('Raw Image Count per Label', color='#2C2C2A', fontsize=12,
                 fontweight='bold', pad=12, loc='left')
    ax.set_ylabel('Number of Images', color='#888780', fontsize=10)
    style_ax(ax)
    plt.tight_layout()
    fig_to_st(fig)
    most  = df_raw.iloc[0]
    least = df_raw.iloc[-1]
    insight(f"Label terbanyak: <b>{most['label']}</b> ({most['raw_count']:,} gambar) — "
            f"label tersedikit: <b>{least['label']}</b> ({least['raw_count']:,} gambar). "
            f"Selisih {most['raw_count'] - least['raw_count']:,} gambar.")
else:
    row = per_label[per_label['label'] == selected_label].iloc[0]
    fig, ax = plt.subplots(figsize=(6, 4))
    fig.patch.set_facecolor('white')
    vals_bar = [row['raw_count'], row['before'], row['after']]
    bars = ax.bar(['Raw', 'Before Aug', 'After Aug'], vals_bar,
                  color=[TEAL2, ORANGE, TEAL], width=0.45, edgecolor='none', zorder=3)
    for bar, val in zip(bars, vals_bar):
        ax.text(bar.get_x() + bar.get_width()/2,
                bar.get_height() + max(vals_bar)*0.01,
                f'{int(val):,}', ha='center', va='bottom',
                fontsize=11, fontweight='bold', color='#2C2C2A')
    ax.set_title(f'Image Count — {selected_label}', color='#2C2C2A',
                 fontsize=12, fontweight='bold', pad=12, loc='left')
    ax.set_ylabel('Number of Images', color='#888780', fontsize=10)
    style_ax(ax)
    plt.tight_layout()
    fig_to_st(fig)
    aug_pct = (row['after'] - row['before']) / row['before'] * 100 if row['before'] > 0 else 0
    insight(f"Label <b>{selected_label}</b> memiliki <b>{int(row['raw_count']):,}</b> gambar raw. "
            f"Setelah augmentasi bertambah <b>+{aug_pct:.1f}%</b> menjadi <b>{int(row['after']):,}</b> gambar.")

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ============================================================
# SECTION 3 — CLEANING (hanya All Labels)
# ============================================================
if selected_label == 'All Labels':
    st.markdown('<div class="section-title">Data Cleaning</div>', unsafe_allow_html=True)
    st.markdown('<div class="section-sub">Hasil penghapusan duplikat dan identifikasi gambar bermasalah</div>', unsafe_allow_html=True)

    col1, col2 = st.columns(2)

    with col1:
        dup_before = int(summary['duplicate_count'])
        dup_after  = int(summary['duplicates'])
        fig, ax = plt.subplots(figsize=(5, 4))
        fig.patch.set_facecolor('white')
        bars = ax.bar([0, 1], [dup_before, dup_after], color=[ORANGE, TEAL],
                      width=0.45, edgecolor='none', zorder=3)
        for bar, val in zip(bars, [dup_before, dup_after]):
            ax.text(bar.get_x() + bar.get_width()/2,
                    bar.get_height() + max(dup_before, dup_after)*0.01,
                    f'{val:,}', ha='center', va='bottom',
                    fontsize=11, fontweight='bold', color='#2C2C2A')
        if dup_before > 0:
            pct = (dup_before - dup_after) / dup_before * 100
            ax.annotate('', xy=(1, dup_after + max(dup_before, dup_after)*0.1),
                        xytext=(0, dup_before + max(dup_before, dup_after)*0.1),
                        arrowprops=dict(arrowstyle='->', color='#888780', lw=1.5))
            ax.text(0.5, max(dup_before, dup_after)*0.88,
                    f'-{pct:.1f}%', ha='center', color=TEAL, fontsize=10, fontweight='bold')
        ax.set_xticks([0, 1])
        ax.set_xticklabels(['Before Cleaning', 'After Cleaning'], color='#5F5E5A', fontsize=10)
        ax.set_title('Duplicate Images', color='#2C2C2A', fontsize=12,
                     fontweight='bold', pad=12, loc='left')
        ax.set_ylabel('Count', color='#888780', fontsize=10)
        style_ax(ax)
        plt.tight_layout()
        fig_to_st(fig)
        insight(f"Berhasil menghapus <b>{dup_before - dup_after:,} duplikat</b> dari dataset.")

    with col2:
        size_vals = [int(summary['small_images']), int(summary['large_images'])]
        fig, ax = plt.subplots(figsize=(5, 4))
        fig.patch.set_facecolor('white')
        bars = ax.bar([0, 1], size_vals, color=[ORANGE, TEAL],
                      width=0.45, edgecolor='none', zorder=3)
        for bar, val in zip(bars, size_vals):
            ax.text(bar.get_x() + bar.get_width()/2,
                    bar.get_height() + max(size_vals)*0.01,
                    f'{val:,}', ha='center', va='bottom',
                    fontsize=11, fontweight='bold', color='#2C2C2A')
        ax.set_xticks([0, 1])
        ax.set_xticklabels(['Small (<50px)', 'Large (>2000px)'], color='#5F5E5A', fontsize=10)
        ax.set_title('Image Size Issues', color='#2C2C2A', fontsize=12,
                     fontweight='bold', pad=12, loc='left')
        ax.set_ylabel('Count', color='#888780', fontsize=10)
        style_ax(ax)
        plt.tight_layout()
        fig_to_st(fig)
        insight(f"Ditemukan <b>{size_vals[0]:,} gambar terlalu kecil</b> dan <b>{size_vals[1]:,} gambar terlalu besar</b>.")

    st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ============================================================
# SECTION 4 — AUGMENTASI & BALANCING
# ============================================================
st.markdown('<div class="section-title">Augmentation & Balancing</div>', unsafe_allow_html=True)
st.markdown('<div class="section-sub">Perbandingan distribusi data sebelum dan sesudah augmentasi</div>', unsafe_allow_html=True)

if selected_label == 'All Labels':
    col1, col2 = st.columns(2)

    with col1:
        tot_before = int(summary['total_before'])
        tot_after  = int(summary['total_after'])
        fig, ax = plt.subplots(figsize=(5, 4))
        fig.patch.set_facecolor('white')
        bars = ax.bar([0, 1], [tot_before, tot_after], color=[ORANGE, TEAL],
                      width=0.45, edgecolor='none', zorder=3)
        for bar, val in zip(bars, [tot_before, tot_after]):
            ax.text(bar.get_x() + bar.get_width()/2,
                    bar.get_height() + max(tot_before, tot_after)*0.01,
                    f'{val:,}', ha='center', va='bottom',
                    fontsize=11, fontweight='bold', color='#2C2C2A')
        pct = (tot_after - tot_before) / tot_before * 100 if tot_before > 0 else 0
        ax.annotate('', xy=(1, tot_after + max(tot_before, tot_after)*0.1),
                    xytext=(0, tot_before + max(tot_before, tot_after)*0.1),
                    arrowprops=dict(arrowstyle='->', color='#888780', lw=1.5))
        ax.text(0.5, max(tot_before, tot_after)*0.88,
                f'+{pct:.1f}%', ha='center', color=TEAL, fontsize=10, fontweight='bold')
        ax.set_xticks([0, 1])
        ax.set_xticklabels(['Before', 'After'], color='#5F5E5A', fontsize=10)
        ax.set_title('Total Dataset', color='#2C2C2A', fontsize=12,
                     fontweight='bold', pad=12, loc='left')
        ax.set_ylabel('Number of Images', color='#888780', fontsize=10)
        style_ax(ax)
        plt.tight_layout()
        fig_to_st(fig)
        insight(
            f"Total data setelah seleksi 20 label dan penghapusan duplikat: <b>{tot_before:,} gambar</b>. "
            f"17 label dihapus (semangka, lobak, kedelai, kentang, delima, bayam, jagung, kacang polong, "
            f"pir, paprika, jeruk, anggur, terong, kembang kol, bit, jahe, mangga) karena tidak relevan "
            f"dengan fokus dataset NutriVision. "
            f"Setelah augmentasi & balancing menjadi <b>{tot_after:,} gambar</b> (+{pct:.1f}%)."
        )

    with col2:
        df_small5 = per_label.nsmallest(5, 'before')
        x5 = np.arange(len(df_small5))
        w  = 0.38
        fig, ax = plt.subplots(figsize=(6, 4))
        fig.patch.set_facecolor('white')
        b1 = ax.bar(x5 - w/2, df_small5['before'], width=w, color=ORANGE,
                    edgecolor='none', label='Before', zorder=3)
        b2 = ax.bar(x5 + w/2, df_small5['after'],  width=w, color=TEAL,
                    edgecolor='none', label='After', zorder=3)
        for bar in list(b1) + list(b2):
            ax.text(bar.get_x() + bar.get_width()/2,
                    bar.get_height() + df_small5['after'].max()*0.01,
                    f'{int(bar.get_height()):,}',
                    ha='center', va='bottom', fontsize=7.5, color='#444441')
        ax.set_xticks(x5)
        ax.set_xticklabels(df_small5['label'], rotation=30, ha='right',
                           fontsize=9, color='#5F5E5A')
        ax.legend(frameon=False, fontsize=9, labelcolor='#5F5E5A')
        ax.set_title('5 Smallest Labels — Before vs After', color='#2C2C2A',
                     fontsize=12, fontweight='bold', pad=12, loc='left')
        ax.set_ylabel('Number of Images', color='#888780', fontsize=10)
        style_ax(ax)
        plt.tight_layout()
        fig_to_st(fig)
        insight("5 label dengan data paling sedikit berhasil di-balance hingga setara dengan label lainnya.")

    fig, ax = plt.subplots(figsize=(14, 5))
    fig.patch.set_facecolor('white')
    df_after = per_label.sort_values('after', ascending=False)
    x = np.arange(len(df_after))
    bar_colors = [TEAL if i % 2 == 0 else TEAL2 for i in range(len(df_after))]
    bars = ax.bar(x, df_after['after'], color=bar_colors, width=0.6,
                  edgecolor='none', zorder=3)
    for bar, val in zip(bars, df_after['after']):
        ax.text(bar.get_x() + bar.get_width()/2,
                bar.get_height() + df_after['after'].max()*0.005,
                f'{val:,}', ha='center', va='bottom', fontsize=7, color='#444441')
    ax.set_xticks(x)
    ax.set_xticklabels(df_after['label'], rotation=40, ha='right',
                       fontsize=9, color='#5F5E5A')
    ax.set_title('Distribution After Balancing — All Labels', color='#2C2C2A',
                 fontsize=12, fontweight='bold', pad=12, loc='left')
    ax.set_ylabel('Number of Images', color='#888780', fontsize=10)
    style_ax(ax)
    plt.tight_layout()
    fig_to_st(fig)

else:
    row = per_label[per_label['label'] == selected_label].iloc[0]
    fig, ax = plt.subplots(figsize=(6, 4))
    fig.patch.set_facecolor('white')
    bars = ax.bar(['Before', 'After'], [row['before'], row['after']],
                  color=[ORANGE, TEAL], width=0.45, edgecolor='none', zorder=3)
    for bar, val in zip(bars, [row['before'], row['after']]):
        ax.text(bar.get_x() + bar.get_width()/2,
                bar.get_height() + max(row['before'], row['after'])*0.01,
                f'{int(val):,}', ha='center', va='bottom',
                fontsize=11, fontweight='bold', color='#2C2C2A')
    if row['before'] > 0:
        pct = (row['after'] - row['before']) / row['before'] * 100
        ax.annotate('', xy=(1, row['after'] + max(row['before'], row['after'])*0.1),
                    xytext=(0, row['before'] + max(row['before'], row['after'])*0.1),
                    arrowprops=dict(arrowstyle='->', color='#888780', lw=1.5))
        ax.text(0.5, max(row['before'], row['after'])*0.88,
                f'+{pct:.1f}%', ha='center', color=TEAL, fontsize=10, fontweight='bold')
    ax.set_title(f'Augmentation — {selected_label}', color='#2C2C2A',
                 fontsize=12, fontweight='bold', pad=12, loc='left')
    ax.set_ylabel('Number of Images', color='#888780', fontsize=10)
    style_ax(ax)
    plt.tight_layout()
    fig_to_st(fig)
    insight(f"Label <b>{selected_label}</b> bertambah dari <b>{int(row['before']):,}</b> menjadi "
            f"<b>{int(row['after']):,}</b> gambar setelah augmentasi (+{pct:.1f}%).")

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ============================================================
# SECTION 5 — PREPROCESSING
# ============================================================
st.markdown('<div class="section-title">Preprocessing Analysis</div>', unsafe_allow_html=True)
st.markdown('<div class="section-sub">Distribusi nilai pixel, brightness, dan padding ratio setelah resize 224x224</div>', unsafe_allow_html=True)

col1, col2 = st.columns(2)

with col1:
    pixel_vals = dist['pixel_value'].dropna().values
    if len(pixel_vals) > 0:
        fig, ax = plt.subplots(figsize=(6, 4))
        fig.patch.set_facecolor('white')
        ax.hist(pixel_vals, bins=50, color=TEAL, edgecolor='none', alpha=0.85, zorder=3)
        mean_v = np.mean(pixel_vals)
        std_v  = np.std(pixel_vals)
        ax.axvline(mean_v, color=ORANGE, linewidth=1.8, linestyle='--',
                   label=f'Mean: {mean_v:.2f}')
        ax.axvline(mean_v - std_v, color='#B5B2A9', linewidth=1.2, linestyle=':',
                   label=f'Std: {std_v:.2f}')
        ax.axvline(mean_v + std_v, color='#B5B2A9', linewidth=1.2, linestyle=':')
        ax.legend(frameon=False, fontsize=9, labelcolor='#5F5E5A')
        ax.set_title('Pixel Value Distribution', color='#2C2C2A', fontsize=12,
                     fontweight='bold', pad=12, loc='left')
        ax.set_xlabel('Pixel Value', color='#888780', fontsize=10)
        ax.set_ylabel('Frequency', color='#888780', fontsize=10)
        style_ax(ax)
        plt.tight_layout()
        fig_to_st(fig)
        insight(f"Rata-rata nilai pixel <b>{mean_v:.2f}</b> dengan standar deviasi <b>{std_v:.2f}</b>.")

with col2:
    df_bright = df_dist[['label', 'brightness']].dropna()
    if len(df_bright) > 0:
        if selected_label == 'All Labels':
            labels_b = sorted(df_bright['label'].unique())
            data_b   = [df_bright[df_bright['label'] == l]['brightness'].values for l in labels_b]
            fig, ax  = plt.subplots(figsize=(6, 4))
            fig.patch.set_facecolor('white')
            bp = ax.boxplot(data_b, patch_artist=True,
                            medianprops=dict(color=ORANGE, linewidth=2),
                            whiskerprops=dict(color='#B5B2A9'),
                            capprops=dict(color='#B5B2A9'),
                            flierprops=dict(marker='o', color='#B5B2A9', markersize=3))
            for patch in bp['boxes']:
                patch.set_facecolor('#9FE1CB')
                patch.set_alpha(0.7)
            ax.set_xticks(range(1, len(labels_b)+1))
            ax.set_xticklabels(labels_b, rotation=45, ha='right', fontsize=8, color='#5F5E5A')
            brightest = df_bright.groupby('label')['brightness'].mean().idxmax()
            darkest   = df_bright.groupby('label')['brightness'].mean().idxmin()
            insight(f"Label paling terang: <b>{brightest}</b> — label paling gelap: <b>{darkest}</b>.")
        else:
            vals = df_bright['brightness'].values
            fig, ax = plt.subplots(figsize=(6, 4))
            fig.patch.set_facecolor('white')
            ax.hist(vals, bins=30, color=TEAL, edgecolor='none', alpha=0.85, zorder=3)
            ax.axvline(vals.mean(), color=ORANGE, linewidth=1.8, linestyle='--',
                       label=f'Mean: {vals.mean():.3f}')
            ax.legend(frameon=False, fontsize=9, labelcolor='#5F5E5A')
            insight(f"Rata-rata brightness label <b>{selected_label}</b>: <b>{vals.mean():.3f}</b>.")

        ax.set_title('Brightness Distribution', color='#2C2C2A', fontsize=12,
                     fontweight='bold', pad=12, loc='left')
        ax.set_ylabel('Value', color='#888780', fontsize=10)
        style_ax(ax)
        plt.tight_layout()
        fig_to_st(fig)

# Padding ratio
st.markdown("#### Average Padding Ratio per Label")
df_pad     = df_dist[['label', 'padding_ratio']].dropna()
df_pad_avg = df_pad.groupby('label')['padding_ratio'].mean().sort_values(ascending=False).reset_index()

if len(df_pad_avg) > 0:
    fig, ax = plt.subplots(figsize=(14 if selected_label == 'All Labels' else 5, 4))
    fig.patch.set_facecolor('white')
    x = np.arange(len(df_pad_avg))
    bars = ax.bar(x, df_pad_avg['padding_ratio'] * 100, color=TEAL,
                  width=0.6, edgecolor='none', zorder=3)
    for bar, val in zip(bars, df_pad_avg['padding_ratio'] * 100):
        ax.text(bar.get_x() + bar.get_width()/2,
                bar.get_height() + 0.001,
                f'{val:.3f}%', ha='center', va='bottom', fontsize=8, color='#444441')
    ax.set_xticks(x)
    ax.set_xticklabels(df_pad_avg['label'], rotation=45, ha='right',
                       fontsize=9, color='#5F5E5A')
    ax.set_title(f'Average Padding Ratio — {selected_label}', color='#2C2C2A',
                 fontsize=12, fontweight='bold', pad=12, loc='left')
    ax.set_ylabel('Padding Ratio (%)', color='#888780', fontsize=10)
    max_val = df_pad_avg['padding_ratio'].max() * 100
    if max_val < 0.1:
        ax.set_ylim(0, 0.1)
    style_ax(ax)
    plt.tight_layout()
    fig_to_st(fig)
    top = df_pad_avg.iloc[0]
    insight(f"Label dengan padding ratio tertinggi: <b>{top['label']}</b> ({top['padding_ratio']*100:.3f}%).")

st.markdown('<hr class="divider">', unsafe_allow_html=True)

# ============================================================
# SECTION 6 — VISUAL RESIZE (otomatis ikut sidebar)
# ============================================================
st.markdown('<div class="section-title">Visual Comparison — Before vs After Resize</div>', unsafe_allow_html=True)
st.markdown('<div class="section-sub">Perbandingan gambar asli dengan hasil resize + padding 224x224</div>', unsafe_allow_html=True)

before_dir = 'notebooks (datascience)/streamlit/data/image/before'
after_dir  = 'notebooks (datascience)/streamlit/data/image/after'

if os.path.exists(before_dir) and os.path.exists(after_dir):
    all_files    = [f for f in os.listdir(before_dir) if f.endswith('.jpg')]
    avail_labels = sorted(set(f.rsplit('_', 1)[0] for f in all_files))

    if selected_label != 'All Labels' and selected_label in avail_labels:
        img_label = selected_label
    else:
        img_label = avail_labels[0] if avail_labels else None

    if img_label:
        if selected_label == 'All Labels':
            col_sel, _ = st.columns([2, 3])
            with col_sel:
                img_label = st.selectbox("Pilih label untuk preview gambar:",
                                         avail_labels,
                                         index=avail_labels.index(img_label))
        else:
            st.markdown(f'<div style="font-size:13px; color:#888780; margin-bottom:1rem;">Menampilkan gambar untuk label: <b style="color:#1D9E75">{img_label}</b></div>',
                        unsafe_allow_html=True)

        samples = [f for f in all_files if f.startswith(img_label + '_')]
        for fname in samples:
            before_path = os.path.join(before_dir, fname)
            after_path  = os.path.join(after_dir, fname)
            if os.path.exists(before_path) and os.path.exists(after_path):
                img_b = Image.open(before_path)
                img_a = Image.open(after_path)
                col_b, col_a = st.columns(2)
                with col_b:
                    st.image(img_b, use_column_width=True)
                    st.markdown(f'<div class="image-label">Before — {img_b.size[0]}x{img_b.size[1]}px</div>',
                                unsafe_allow_html=True)
                with col_a:
                    st.image(img_a, use_column_width=True)
                    st.markdown('<div class="image-label">After — 224x224px (with padding)</div>',
                                unsafe_allow_html=True)
                st.markdown("<br>", unsafe_allow_html=True)
else:
    st.warning("Folder images tidak ditemukan.")

# ============================================================
# FOOTER
# ============================================================
st.markdown('<hr class="divider">', unsafe_allow_html=True)
st.markdown("""
<div style="text-align:center; color:#888780; font-size:13px; padding-bottom:1rem;">
    NutriVision — Data Preprocessing Exploration Dashboard
</div>
""", unsafe_allow_html=True)