import tensorflow as tf

# تحميل النموذج
model = tf.keras.models.load_model("xray_model.keras")

# طباعة جميع الطبقات
print("\n📦 Model Summary:")
model.summary()

print("\n📋 Layer Names:")
for layer in model.layers:
    print(f"🔹 {layer.name} - {layer.__class__.__name__}")
